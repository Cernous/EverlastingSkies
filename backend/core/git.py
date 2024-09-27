import json
import time
from github import Github, Auth, Organization
import github
import requests
from requests import HTTPError
from dotenv import load_dotenv

import os
from os import getenv

load_dotenv()

__TOKEN = getenv("GH_API_TOKEN")
__API_VERSION = getenv("GH_API_VERSION")
__AUTH = Auth.Token(__TOKEN)

__PRIVATE_ORG = getenv("GH_PRIVATE_ORG")
__LOCAL_RELEASE_DIR = getenv("GH_RELEASES_DIR")

def getRepoList(g:Organization.Organization):
    names = []
    for repo in g.get_repos():
        names.append(repo.name)
    return names

def getRepoInfo(g:Organization.Organization, name: str = None):
    if name not in getRepoList(g):
        raise Exception(f"Repository {name} not in the available repository list on GitHub")
    
    Repo = g.get_repo(name)
    info = {
        "Name": Repo.name,
        "Description": Repo.description,
        "URL": Repo.url,
        "Local_Path": os.path.abspath(os.curdir + __LOCAL_RELEASE_DIR + f"/{Repo.name}/")
    }

    # NOTE: You can do a lot more here

    return dict(info)

def getRepoLatestTag(g:Organization.Organization, name: str =None):
    """
    Returns the latest non-empty release tag
    * Will Raise Exception
    """
    
    if name not in getRepoList(g):
        raise Exception(f"Repository {name} not in the available repository list on GitHub")
    release = None
    i = 0
    while release is None:
        tag = g.get_repo(name).get_tags()[i]
        try:
            release = g.get_repo(name).get_release(tag.name)
            release = None if len(release.assets) == 0 else release
        except Exception as e:
            #print(e, "\n", tag.name)
            pass
        i+=1
    return tag.name

def getRepoReleaseAssetURL(g:Organization.Organization, name: str=None, tag: str=None):
    """
    Returns the latest non-empty release asset download URLs
    * Will Raise Exception
    """
    if name not in getRepoList(g):
        raise Exception(f"Repository {name} not in the available repository list on GitHub")
    if tag not in [tags.name for tags in g.get_repo(name).get_tags()]:
        raise Exception(f"Tag {tag} not in the repository {name}")
    
    assets = g.get_repo(name).get_release(tag).assets
    download_urls = []
    for asset in assets:
        download_urls.append({"URL": asset.url, "Name": asset.name})
    return download_urls

def createList():
    git = Github(auth=__AUTH)
    g = git.get_organization(__PRIVATE_ORG)
    names = getRepoList(g)
    parsed = []
    for name in names:
        RepoInfo = getRepoInfo(g,name)
        try:
            RepoInfo["Tag"] = getRepoLatestTag(g,name)
            RepoInfo["DL_URLs"] = getRepoReleaseAssetURL(g,name, RepoInfo["Tag"])
            parsed.append(RepoInfo)
            print(f"DONE:{name}")
        except Exception as e:
            print(f"FAIL:{name} {str(e)}")
    git.close()
    return list(parsed)

def refreshList(repoInfoList: list[dict]):
    if len(repoInfoList) == 0:
        raise Exception("No repo in the list?")
    names = [d["Name"] for d in repoInfoList]
    parsed = []
    git = Github(auth=__AUTH)
    g = git.get_organization(__PRIVATE_ORG)
    for name in names:
        RepoInfo = getRepoInfo(g,name)
        try:
            RepoInfo["Tag"] = getRepoLatestTag(g,name)
            RepoInfo["DL_URLs"] = getRepoReleaseAssetURL(g,name, RepoInfo["Tag"])
            parsed.append(RepoInfo)
            print(f"DONE:{name}")
        except Exception as e:
            print(f"FAIL:{name} {str(e)}")
    git.close()
    return list(parsed)

def readManifest():
    filePath = os.path.abspath(os.curdir + __LOCAL_RELEASE_DIR + "/manifest.json")
    if not os.path.exists(filePath):
        raise FileNotFoundError(f"Cannot find file {filePath}")
    with open(filePath, "r") as f:
        data = json.loads(f.read())
        f.close()
    return data

def updateManifest(repoList:list[dict]):
    with open(os.path.abspath(os.curdir + __LOCAL_RELEASE_DIR + "/manifest.json"), "w") as f:
        json.dump(obj=repoList, fp=f, indent="\t")
        f.close()

def downloadAsset(repoDict: dict):
    urls = repoDict["DL_URLs"]
    headers = {
        "Authorization": "Bearer " + __TOKEN,
        "X-GitHub-Api-Version": __API_VERSION,
        "Accept": "application/octet-stream"
    }
    for url in urls:
        try:
            with requests.get(url["URL"], headers=headers, stream=True) as r:
                r.raise_for_status()
                if not os.path.isdir(repoDict["Local_Path"]):
                    os.makedirs(repoDict["Local_Path"], exist_ok=True)
                with open(repoDict["Local_Path"]+f"/{url["Name"]}", 'wb') as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
                    f.close()
        except HTTPError as http_err:
            print(f"Http Error occured: {str(http_err)}")
        except Exception as e:
            print(f"Exception as occured: {str(e)}")


def downloadSequence(old_list:list[dict], new_list:list[dict]):
    if old_list == None:
        old_list = []
        p_list = []
    elif len(old_list) == 0:
        p_list = []
    else:
        p_list = [p["Name"] for p in old_list]
    for new in new_list:
        if not os.path.exists(new["Local_Path"]):
            os.makedirs(exist_ok=True, name=new["Local_Path"])
            downloadAsset(new)
            print(f"New Download: {new["Name"]}")
            continue

        if new["Name"] in p_list:
            i = p_list.index(new["Name"])
            if old_list[i]["Tag"] != new["Tag"]:
                for filename in os.listdir(new["Local_Path"]):
                    os.remove(new["Local_Path"]+f"/{filename}")
                downloadAsset(new)
                print(f"New Update: {new["Name"]}")
            else:
                print(f"No Update: {new["Name"]}")

def init():
    start = time.time()
    try:
        parsed = readManifest()
    except Exception as e:
        print(e)
        parsed = None
    new_parsed = createList()
    stop = time.time()
    updateManifest(new_parsed)
    downloadSequence(parsed, new_parsed)
    duration = f"{int((stop-start)/60)}: {int((stop - start)%60)} minutes"
    print(f"DURATION: {duration}")

def refresh():
    start = time.time()
    parsed = readManifest()
    new_parsed = refreshList(parsed)
    stop = time.time()
    updateManifest(new_parsed)
    downloadSequence(parsed, new_parsed)
    duration = f"{int((stop-start)/60)}: {int((stop - start)%60)} minutes"
    print(f"DURATION: {duration}")

if __name__ == "__main__":
    # start = time.time()
    # parsed = createList()
    # stop = time.time()
    # duration = f"{int((stop-start)/60)}: {int((stop - start)%60)} minutes"
    # updateManifest(parsed)
    # print(f"DURATION: {duration}")

    start = time.time()
    parsed = readManifest()
    new_parsed = refreshList(parsed)
    stop = time.time()
    duration = f"{int((stop-start)/60)}: {int((stop - start)%60)} minutes"
    print(f"DURATION: {duration}")
    
    start = time.time()
    p_list = [p["Name"] for p in parsed]
    for new in new_parsed:
        if not os.path.exists(new["Local_Path"]):
            os.makedirs(exist_ok=True, name=new["Local_Path"])
            downloadAsset(new)
            print(f"New Download: {new["Name"]}")
            continue

        if new["Name"] in p_list:
            i = p_list.index(new["Name"])
            if parsed[i]["Tag"] != new["Tag"]:
                for filename in os.listdir(new["Local_Path"]):
                    os.remove(new["Local_Path"]+f"/{filename}")
                downloadAsset(new)
                print(f"New Update: {new["Name"]}")
            else:
                print(f"No Update: {new["Name"]}")
    updateManifest(new_parsed)
    stop = time.time()
    duration = f"{int((stop-start)/60)}: {int((stop - start)%60)} minutes"
    print(f"DURATION: {duration}")




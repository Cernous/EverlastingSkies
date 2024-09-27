from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from models import DownloadableItem, DownloadableItems

import os

from core import git

router = APIRouter()

# Put this in a env file
repo_dir = os.path.curdir+ "/static/"

@router.get("/", response_model=DownloadableItems)
def read_items() -> Any:
    allrepos = git.readManifest()
    allitems = []
    for repo in allrepos:
        item = {
            "name": repo["Name"],
            "description": repo["Description"],
            "tag": repo["Tag"],
            "filename": repo["DL_URLs"][0]["Name"]
        }
        allitems.append(DownloadableItem(**item))

    return DownloadableItems(data=allitems, count=len(allitems))

@router.get("/download/{item_name}")
def download_item(item_name: str):  
    allrepos = git.readManifest()
    index = [p["Name"] for p in allrepos].index(item_name)
    print(allrepos[index]["Local_Path"] + f"/{allrepos[index]['DL_URLs'][0]['Name']}", allrepos[index]['DL_URLs'][0]['Name'])
    response=FileResponse(
        path=allrepos[index]["Local_Path"] + f"/{allrepos[index]['DL_URLs'][0]['Name']}",
        media_type='application/octet-stream',
        filename=allrepos[index]['DL_URLs'][0]['Name']
        )
    return response

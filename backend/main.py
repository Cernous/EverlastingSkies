from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from api.router import api_router

from core.config import settings

from core import git

def custom_generate_unique_id(route: APIRoute):
    return f'{route.tags[0]}-{route.name}'

# git.refresh()

app = FastAPI(
    title=settings.PROJECT_NAME,
    generate_unique_id_function=custom_generate_unique_id,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins= [
        # insert react domain
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],                              
)

app.include_router(api_router, prefix=settings.API_V1_STR)
import uvicorn
from fastapi import Depends

from setup import settings
from setup.app_factory import create_app
from setup.ioc_container import container
from fastapi.responses import Response

app = create_app()


@app.get("/ping")
async def ping(message: str = Depends(lambda: container.get(str))):
    return message


def run_uvicorn_server():
    uvicorn.run(
        "index:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.IS_DEBUB,
        workers=settings.SERVER_WORKER_COUNT,
    )

import uvicorn

from setup import settings
from setup.app_factory import create_app

app = create_app()


def run_uvicorn_server():
    uvicorn.run(
        "index:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.IS_DEBUB,
        workers=settings.SERVER_WORKER_COUNT,
    )

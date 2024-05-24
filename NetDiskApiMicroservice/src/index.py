import uvicorn

from setup.config import settings
from setup.app_factory import create_app

app = create_app()


def run_uvicorn_server():
    uvicorn.run(
        "index:app",
        host=settings.server.host,
        port=settings.server.port,
        reload=settings.server.is_debug,
        workers=settings.server.worker_count,
    )

from fastapi import FastAPI

from presentation.rest.api.v1 import router


def create_app():
    app = FastAPI(debug=True)
    app.include_router(router)

    return app

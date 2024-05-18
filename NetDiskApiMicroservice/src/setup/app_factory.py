from fastapi import FastAPI


def create_app():
    app = FastAPI(debug=True)
    return app

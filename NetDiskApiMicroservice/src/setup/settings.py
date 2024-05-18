import pathlib

import environ

env = environ.Env(IS_DEBUG=(bool, True))
environ.Env.read_env(str(pathlib.Path(".").joinpath(".env")))


IS_DEBUB: bool = env("IS_DEBUG")

SERVER_WORKER_COUNT = 1
SERVER_HOST: str = env("SERVER_HOST")
SERVER_PORT: int = env("SERVER_PORT", cast=int)

DATABASE_URL: str = env("DATABASE_URL")

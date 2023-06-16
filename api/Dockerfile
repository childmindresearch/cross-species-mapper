FROM python:3.11-slim-buster

WORKDIR /app

COPY poetry.lock pyproject.toml ./

RUN pip install poetry && \
    poetry install

COPY . .

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
FROM postgres:latest

ENV POSTGRES_USER user

ENV POSTGRES_PASSWORD pass

ENV POSTGRES_DB db

ADD db/schema.sql /docker-entrypoint-initdb.d/1.sql

ADD db/functions.sql /docker-entrypoint-initdb.d/2.sql
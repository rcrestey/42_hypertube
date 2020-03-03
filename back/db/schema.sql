CREATE TYPE "prefered_lg" AS ENUM (
    'FR',
    'EN',
    'ES'
);

CREATE TYPE "provider" AS ENUM (
    'LOCAL',
    'GOOGLE',
    '42'
);

CREATE TYPE "image_kind" AS ENUM (
    'LOCAL',
    'EXTERN'
);

CREATE TYPE "state" AS ENUM (
    'ON',
    'OFF'
);

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "uuid" uuid NOT NULL,
    "provider_id" numeric NOT NULL DEFAULT 0,
    "provider" provider NOT NULL,
    "username" text NOT NULL,
    "email" text NOT NULL,
    "given_name" text NOT NULL,
    "family_name" text NOT NULL,
    "prefered_lg" prefered_lg NOT NULL,
    "photo_id" int,
    "password" text,
    "state" state DEFAULT 'OFF',
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "film_history" (
    "id" SERIAL PRIMARY KEY,
    "user_id" int NOT NULL,
    "film_id" int NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "comments" (
    "id" SERIAL PRIMARY KEY,
    "user_id" int NOT NULL,
    "film_id" int NOT NULL,
    "payload" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "tokens" (
    "id" SERIAL PRIMARY KEY,
    "user_id" int NOT NULL,
    "token" uuid NOT NULL,
    "state" state DEFAULT 'ON',
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "images" (
    "id" SERIAL PRIMARY KEY,
    "uuid" uuid NOT NULL,
    "kind" image_kind DEFAULT 'LOCAL',
    "src" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE "users"
ADD
    FOREIGN KEY ("photo_id") REFERENCES "images" ("id");

ALTER TABLE "tokens"
ADD
    FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comments"
ADD
    FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "film_history"
ADD
    FOREIGN KEY ("user_id") REFERENCES "users" ("id");

CREATE UNIQUE INDEX ON "users" ("uuid");
CREATE UNIQUE INDEX ON "users" ("username");
CREATE UNIQUE INDEX ON "users" ("email");

CREATE UNIQUE INDEX ON "images" ("uuid");

CREATE UNIQUE INDEX ON "tokens" ("token");
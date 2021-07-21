set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userID" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"refreshToken" TEXT NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userID")
) WITH (
  OIDS=FALSE
);

`

CREATE TABLE "public.subscriptions" (
	"subscriptionID" serial NOT NULL,
	"userID" integer NOT NULL,
	"keywords" TEXT NOT NULL,
	"subreddit" TEXT NOT NULL,
	CONSTRAINT "subscriptions_pk" PRIMARY KEY ("subscriptionID")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk0" FOREIGN KEY ("userID") REFERENCES "users"("userID");

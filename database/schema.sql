set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"refreshToken" TEXT NOT NULL,
	"createdAt" timestamp with time zone NOT NULL default now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."subscriptions" (
<<<<<<< HEAD
	"subscriptionId" serial NOT NULL,
	"userId" integer NOT NULL,
=======
	"subscriptionID" serial NOT NULL,
	"userID" integer NOT NULL,
>>>>>>> e968f04cf105332706d240b3d1754725db66ce6c
	"keywords" TEXT NOT NULL,
	"subreddit" TEXT NOT NULL,
	CONSTRAINT "subscriptions_pk" PRIMARY KEY ("subscriptionId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"busy" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_name_unique" UNIQUE("name")
);

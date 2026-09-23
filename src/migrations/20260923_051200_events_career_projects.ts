import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_category" AS ENUM('company-award-ceremony', 'annual-dinner', 'team-building', 'recreational', 'company-trip', 'csr-activities');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('completed', 'ongoing');
  CREATE TYPE "public"."enum_job_applications_status" AS ENUM('new', 'in-review', 'closed');
  CREATE TABLE "events_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_events_category" DEFAULT 'company-award-ceremony' NOT NULL,
  	"event_date" timestamp(3) with time zone NOT NULL,
  	"cover_id" integer,
  	"youtube_url" varchar,
  	"published" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_consultants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_projects_status" DEFAULT 'ongoing' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"cover_id" integer,
  	"client" varchar,
  	"scope" varchar,
  	"commencement_date" timestamp(3) with time zone,
  	"completion_date" timestamp(3) with time zone,
  	"body" jsonb,
  	"published" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vacancies_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"label" varchar NOT NULL,
  	"intro" varchar
  );
  
  CREATE TABLE "vacancies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"open" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"vacancy_id" integer NOT NULL,
  	"vacancy_title" varchar NOT NULL,
  	"introduction" varchar NOT NULL,
  	"resume_id" integer NOT NULL,
  	"status" "enum_job_applications_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resumes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "events_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "career_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"apply_heading" varchar NOT NULL,
  	"apply_body" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vacancies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_applications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resumes_id" integer;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_consultants" ADD CONSTRAINT "projects_consultants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancies_sections_items" ADD CONSTRAINT "vacancies_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_sections" ADD CONSTRAINT "vacancies_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_vacancy_id_vacancies_id_fk" FOREIGN KEY ("vacancy_id") REFERENCES "public"."vacancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page" ADD CONSTRAINT "events_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page" ADD CONSTRAINT "events_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_page" ADD CONSTRAINT "projects_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_page" ADD CONSTRAINT "projects_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "career_page" ADD CONSTRAINT "career_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "career_page" ADD CONSTRAINT "career_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_gallery_order_idx" ON "events_gallery" USING btree ("_order");
  CREATE INDEX "events_gallery_parent_id_idx" ON "events_gallery" USING btree ("_parent_id");
  CREATE INDEX "events_gallery_image_idx" ON "events_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_cover_idx" ON "events" USING btree ("cover_id");
  CREATE INDEX "events_seo_seo_og_image_idx" ON "events" USING btree ("seo_og_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "projects_consultants_order_idx" ON "projects_consultants" USING btree ("_order");
  CREATE INDEX "projects_consultants_parent_id_idx" ON "projects_consultants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_seo_seo_og_image_idx" ON "projects" USING btree ("seo_og_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "vacancies_sections_items_order_idx" ON "vacancies_sections_items" USING btree ("_order");
  CREATE INDEX "vacancies_sections_items_parent_id_idx" ON "vacancies_sections_items" USING btree ("_parent_id");
  CREATE INDEX "vacancies_sections_order_idx" ON "vacancies_sections" USING btree ("_order");
  CREATE INDEX "vacancies_sections_parent_id_idx" ON "vacancies_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vacancies_key_idx" ON "vacancies" USING btree ("key");
  CREATE INDEX "vacancies_updated_at_idx" ON "vacancies" USING btree ("updated_at");
  CREATE INDEX "vacancies_created_at_idx" ON "vacancies" USING btree ("created_at");
  CREATE INDEX "job_applications_vacancy_idx" ON "job_applications" USING btree ("vacancy_id");
  CREATE INDEX "job_applications_resume_idx" ON "job_applications" USING btree ("resume_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX "resumes_updated_at_idx" ON "resumes" USING btree ("updated_at");
  CREATE INDEX "resumes_created_at_idx" ON "resumes" USING btree ("created_at");
  CREATE UNIQUE INDEX "resumes_filename_idx" ON "resumes" USING btree ("filename");
  CREATE INDEX "events_page_hero_image_idx" ON "events_page" USING btree ("hero_image_id");
  CREATE INDEX "events_page_seo_seo_og_image_idx" ON "events_page" USING btree ("seo_og_image_id");
  CREATE INDEX "projects_page_hero_image_idx" ON "projects_page" USING btree ("hero_image_id");
  CREATE INDEX "projects_page_seo_seo_og_image_idx" ON "projects_page" USING btree ("seo_og_image_id");
  CREATE INDEX "career_page_hero_image_idx" ON "career_page" USING btree ("hero_image_id");
  CREATE INDEX "career_page_seo_seo_og_image_idx" ON "career_page" USING btree ("seo_og_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancies_fk" FOREIGN KEY ("vacancies_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resumes_fk" FOREIGN KEY ("resumes_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_vacancies_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancies_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX "payload_locked_documents_rels_resumes_id_idx" ON "payload_locked_documents_rels" USING btree ("resumes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_consultants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacancies_sections_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacancies_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacancies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resumes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_gallery" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "projects_consultants" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "vacancies_sections_items" CASCADE;
  DROP TABLE "vacancies_sections" CASCADE;
  DROP TABLE "vacancies" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "resumes" CASCADE;
  DROP TABLE "events_page" CASCADE;
  DROP TABLE "projects_page" CASCADE;
  DROP TABLE "career_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vacancies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_applications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resumes_fk";
  
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_vacancies_id_idx";
  DROP INDEX "payload_locked_documents_rels_job_applications_id_idx";
  DROP INDEX "payload_locked_documents_rels_resumes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vacancies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_applications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resumes_id";
  DROP TYPE "public"."enum_events_category";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_job_applications_status";`)
}

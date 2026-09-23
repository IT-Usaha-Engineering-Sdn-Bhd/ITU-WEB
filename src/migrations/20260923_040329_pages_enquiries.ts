import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'in-progress', 'closed');
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"company_name" varchar,
  	"company_address" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_us_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"portrait_id" integer
  );
  
  CREATE TABLE "about_us_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "about_us" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"background_heading" varchar NOT NULL,
  	"background" varchar NOT NULL,
  	"vision" varchar NOT NULL,
  	"mission" varchar NOT NULL,
  	"leadership_heading" varchar NOT NULL,
  	"leadership_intro" varchar NOT NULL,
  	"milestones_heading" varchar NOT NULL,
  	"milestones_intro" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_us" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"company_number" varchar NOT NULL,
  	"form_title" varchar NOT NULL,
  	"form_description" varchar NOT NULL,
  	"hero_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "privacy_policy_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "privacy_policy_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "privacy_policy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "terms_and_conditions_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "terms_and_conditions_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "terms_and_conditions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enquiries_id" integer;
  ALTER TABLE "about_us_leaders" ADD CONSTRAINT "about_us_leaders_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_leaders" ADD CONSTRAINT "about_us_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us_milestones" ADD CONSTRAINT "about_us_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us_milestones" ADD CONSTRAINT "about_us_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_us" ADD CONSTRAINT "about_us_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_us" ADD CONSTRAINT "contact_us_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_us" ADD CONSTRAINT "contact_us_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "privacy_policy_sections_items" ADD CONSTRAINT "privacy_policy_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_policy_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_policy_sections" ADD CONSTRAINT "privacy_policy_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_policy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_policy" ADD CONSTRAINT "privacy_policy_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "terms_and_conditions_sections_items" ADD CONSTRAINT "terms_and_conditions_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."terms_and_conditions_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "terms_and_conditions_sections" ADD CONSTRAINT "terms_and_conditions_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."terms_and_conditions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "terms_and_conditions" ADD CONSTRAINT "terms_and_conditions_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "about_us_leaders_order_idx" ON "about_us_leaders" USING btree ("_order");
  CREATE INDEX "about_us_leaders_parent_id_idx" ON "about_us_leaders" USING btree ("_parent_id");
  CREATE INDEX "about_us_leaders_portrait_idx" ON "about_us_leaders" USING btree ("portrait_id");
  CREATE INDEX "about_us_milestones_order_idx" ON "about_us_milestones" USING btree ("_order");
  CREATE INDEX "about_us_milestones_parent_id_idx" ON "about_us_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_us_milestones_image_idx" ON "about_us_milestones" USING btree ("image_id");
  CREATE INDEX "about_us_hero_image_idx" ON "about_us" USING btree ("hero_image_id");
  CREATE INDEX "about_us_seo_seo_og_image_idx" ON "about_us" USING btree ("seo_og_image_id");
  CREATE INDEX "contact_us_hero_image_idx" ON "contact_us" USING btree ("hero_image_id");
  CREATE INDEX "contact_us_seo_seo_og_image_idx" ON "contact_us" USING btree ("seo_og_image_id");
  CREATE INDEX "privacy_policy_sections_items_order_idx" ON "privacy_policy_sections_items" USING btree ("_order");
  CREATE INDEX "privacy_policy_sections_items_parent_id_idx" ON "privacy_policy_sections_items" USING btree ("_parent_id");
  CREATE INDEX "privacy_policy_sections_order_idx" ON "privacy_policy_sections" USING btree ("_order");
  CREATE INDEX "privacy_policy_sections_parent_id_idx" ON "privacy_policy_sections" USING btree ("_parent_id");
  CREATE INDEX "privacy_policy_seo_seo_og_image_idx" ON "privacy_policy" USING btree ("seo_og_image_id");
  CREATE INDEX "terms_and_conditions_sections_items_order_idx" ON "terms_and_conditions_sections_items" USING btree ("_order");
  CREATE INDEX "terms_and_conditions_sections_items_parent_id_idx" ON "terms_and_conditions_sections_items" USING btree ("_parent_id");
  CREATE INDEX "terms_and_conditions_sections_order_idx" ON "terms_and_conditions_sections" USING btree ("_order");
  CREATE INDEX "terms_and_conditions_sections_parent_id_idx" ON "terms_and_conditions_sections" USING btree ("_parent_id");
  CREATE INDEX "terms_and_conditions_seo_seo_og_image_idx" ON "terms_and_conditions" USING btree ("seo_og_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_enquiries_fk";
  DROP INDEX "payload_locked_documents_rels_enquiries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "enquiries_id";
   ALTER TABLE "enquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_leaders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_milestones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_us" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "privacy_policy_sections_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "privacy_policy_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "privacy_policy" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_and_conditions_sections_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_and_conditions_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_and_conditions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "about_us_leaders" CASCADE;
  DROP TABLE "about_us_milestones" CASCADE;
  DROP TABLE "about_us" CASCADE;
  DROP TABLE "contact_us" CASCADE;
  DROP TABLE "privacy_policy_sections_items" CASCADE;
  DROP TABLE "privacy_policy_sections" CASCADE;
  DROP TABLE "privacy_policy" CASCADE;
  DROP TABLE "terms_and_conditions_sections_items" CASCADE;
  DROP TABLE "terms_and_conditions_sections" CASCADE;
  DROP TABLE "terms_and_conditions" CASCADE;
  DROP TYPE "public"."enum_enquiries_status";`)
}

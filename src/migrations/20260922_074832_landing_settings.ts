import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_landing_why_us_cards_icon" AS ENUM('ClockCountdown', 'UsersThree', 'Bank', 'Handshake', 'Wrench', 'ShieldCheck', 'Certificate', 'Leaf', 'Buildings', 'Lightning', 'ChartLineUp', 'Target', 'Globe', 'Gear', 'Star', 'CheckCircle');
  CREATE TABLE "landing_facts_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "landing_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"tagline" varchar,
  	"body" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "landing_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_landing_why_us_cards_icon",
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "landing_certs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "landing_clients_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "landing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_punchline" varchar NOT NULL,
  	"hero_learn_more_label" varchar DEFAULT 'Learn More' NOT NULL,
  	"who_we_are_header" varchar NOT NULL,
  	"who_we_are_body" varchar NOT NULL,
  	"who_we_are_cta_label" varchar NOT NULL,
  	"who_we_are_cta_href" varchar NOT NULL,
  	"facts_header" varchar NOT NULL,
  	"facts_body" varchar NOT NULL,
  	"services_header" varchar NOT NULL,
  	"services_body" varchar NOT NULL,
  	"why_us_header" varchar NOT NULL,
  	"certs_header" varchar NOT NULL,
  	"clients_header" varchar NOT NULL,
  	"clients_body" varchar NOT NULL,
  	"projects_header" varchar NOT NULL,
  	"projects_body" varchar NOT NULL,
  	"projects_cta_label" varchar NOT NULL,
  	"projects_cta_href" varchar NOT NULL,
  	"projects_background_image_id" integer,
  	"cta_band_header" varchar NOT NULL,
  	"cta_band_cta_label" varchar NOT NULL,
  	"cta_band_cta_href" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"address" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"fax" varchar,
  	"linkedin" varchar,
  	"instagram" varchar,
  	"facebook" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "landing_facts_stats" ADD CONSTRAINT "landing_facts_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_services_items" ADD CONSTRAINT "landing_services_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_services_items" ADD CONSTRAINT "landing_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_why_us_cards" ADD CONSTRAINT "landing_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_certs_items" ADD CONSTRAINT "landing_certs_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_certs_items" ADD CONSTRAINT "landing_certs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_clients_logos" ADD CONSTRAINT "landing_clients_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_clients_logos" ADD CONSTRAINT "landing_clients_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing" ADD CONSTRAINT "landing_projects_background_image_id_media_id_fk" FOREIGN KEY ("projects_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing" ADD CONSTRAINT "landing_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "landing_facts_stats_order_idx" ON "landing_facts_stats" USING btree ("_order");
  CREATE INDEX "landing_facts_stats_parent_id_idx" ON "landing_facts_stats" USING btree ("_parent_id");
  CREATE INDEX "landing_services_items_order_idx" ON "landing_services_items" USING btree ("_order");
  CREATE INDEX "landing_services_items_parent_id_idx" ON "landing_services_items" USING btree ("_parent_id");
  CREATE INDEX "landing_services_items_image_idx" ON "landing_services_items" USING btree ("image_id");
  CREATE INDEX "landing_why_us_cards_order_idx" ON "landing_why_us_cards" USING btree ("_order");
  CREATE INDEX "landing_why_us_cards_parent_id_idx" ON "landing_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "landing_certs_items_order_idx" ON "landing_certs_items" USING btree ("_order");
  CREATE INDEX "landing_certs_items_parent_id_idx" ON "landing_certs_items" USING btree ("_parent_id");
  CREATE INDEX "landing_certs_items_logo_idx" ON "landing_certs_items" USING btree ("logo_id");
  CREATE INDEX "landing_clients_logos_order_idx" ON "landing_clients_logos" USING btree ("_order");
  CREATE INDEX "landing_clients_logos_parent_id_idx" ON "landing_clients_logos" USING btree ("_parent_id");
  CREATE INDEX "landing_clients_logos_logo_idx" ON "landing_clients_logos" USING btree ("logo_id");
  CREATE INDEX "landing_projects_projects_background_image_idx" ON "landing" USING btree ("projects_background_image_id");
  CREATE INDEX "landing_seo_seo_og_image_idx" ON "landing" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "landing_facts_stats" CASCADE;
  DROP TABLE "landing_services_items" CASCADE;
  DROP TABLE "landing_why_us_cards" CASCADE;
  DROP TABLE "landing_certs_items" CASCADE;
  DROP TABLE "landing_clients_logos" CASCADE;
  DROP TABLE "landing" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TYPE "public"."enum_landing_why_us_cards_icon";`)
}

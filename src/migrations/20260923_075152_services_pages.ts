import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "service_data_centre_critical_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "service_data_centre_testing_equipment" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "service_data_centre_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "service_data_centre" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"intro" varchar NOT NULL,
  	"turnkey_title" varchar NOT NULL,
  	"turnkey_body" varchar NOT NULL,
  	"turnkey_subtitle" varchar NOT NULL,
  	"turnkey_sub_body" varchar NOT NULL,
  	"turnkey_image_id" integer,
  	"critical_title" varchar NOT NULL,
  	"critical_body" varchar NOT NULL,
  	"critical_image_id" integer,
  	"testing_title" varchar NOT NULL,
  	"testing_body" varchar NOT NULL,
  	"testing_image_id" integer,
  	"testing_gallery_title" varchar NOT NULL,
  	"why_heading" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "service_high_tension_power_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "service_high_tension_power" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"note" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "service_high_tension_backup_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "service_high_tension_backup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"note" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "service_high_tension_protection_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "service_high_tension_protection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"note" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "service_high_tension" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"intro" varchar NOT NULL,
  	"divider1_heading" varchar NOT NULL,
  	"divider1_body" varchar NOT NULL,
  	"divider2_heading" varchar NOT NULL,
  	"divider2_body" varchar NOT NULL,
  	"feature_eyebrow" varchar NOT NULL,
  	"feature_title" varchar NOT NULL,
  	"feature_body" varchar NOT NULL,
  	"feature_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "service_project_management_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "service_project_management" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"services_heading" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "service_facilities_management_support_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "service_facilities_management_maintenance_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "service_facilities_management_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "service_facilities_management" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"intro" varchar NOT NULL,
  	"support_title" varchar NOT NULL,
  	"support_body" varchar NOT NULL,
  	"support_image_id" integer,
  	"maintenance_title" varchar NOT NULL,
  	"maintenance_body" varchar NOT NULL,
  	"maintenance_image_id" integer,
  	"why_heading" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "service_dfma_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "service_dfma_capabilities_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "service_dfma_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "service_dfma" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"highlight" varchar NOT NULL,
  	"hero_image_id" integer,
  	"capabilities_title" varchar NOT NULL,
  	"capabilities_image_id" integer,
  	"benefits_title" varchar NOT NULL,
  	"benefits_image_id" integer,
  	"visual_title" varchar NOT NULL,
  	"visual_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "service_data_centre_critical_items" ADD CONSTRAINT "service_data_centre_critical_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_data_centre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_data_centre_testing_equipment" ADD CONSTRAINT "service_data_centre_testing_equipment_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_data_centre_testing_equipment" ADD CONSTRAINT "service_data_centre_testing_equipment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_data_centre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_data_centre_why" ADD CONSTRAINT "service_data_centre_why_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_data_centre_why" ADD CONSTRAINT "service_data_centre_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_data_centre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_data_centre" ADD CONSTRAINT "service_data_centre_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_data_centre" ADD CONSTRAINT "service_data_centre_turnkey_image_id_media_id_fk" FOREIGN KEY ("turnkey_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_data_centre" ADD CONSTRAINT "service_data_centre_critical_image_id_media_id_fk" FOREIGN KEY ("critical_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_data_centre" ADD CONSTRAINT "service_data_centre_testing_image_id_media_id_fk" FOREIGN KEY ("testing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_data_centre" ADD CONSTRAINT "service_data_centre_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_high_tension_power_items" ADD CONSTRAINT "service_high_tension_power_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_high_tension_power"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_high_tension_power" ADD CONSTRAINT "service_high_tension_power_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_high_tension_power" ADD CONSTRAINT "service_high_tension_power_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_high_tension"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_high_tension_backup_items" ADD CONSTRAINT "service_high_tension_backup_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_high_tension_backup"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_high_tension_backup" ADD CONSTRAINT "service_high_tension_backup_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_high_tension_backup" ADD CONSTRAINT "service_high_tension_backup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_high_tension"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_high_tension_protection_items" ADD CONSTRAINT "service_high_tension_protection_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_high_tension_protection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_high_tension_protection" ADD CONSTRAINT "service_high_tension_protection_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_high_tension_protection" ADD CONSTRAINT "service_high_tension_protection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_high_tension"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_high_tension" ADD CONSTRAINT "service_high_tension_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_high_tension" ADD CONSTRAINT "service_high_tension_feature_image_id_media_id_fk" FOREIGN KEY ("feature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_high_tension" ADD CONSTRAINT "service_high_tension_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_project_management_services" ADD CONSTRAINT "service_project_management_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_project_management"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_project_management" ADD CONSTRAINT "service_project_management_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_project_management" ADD CONSTRAINT "service_project_management_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_facilities_management_support_items" ADD CONSTRAINT "service_facilities_management_support_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_facilities_management"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_facilities_management_maintenance_items" ADD CONSTRAINT "service_facilities_management_maintenance_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_facilities_management"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_facilities_management_why" ADD CONSTRAINT "service_facilities_management_why_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_facilities_management_why" ADD CONSTRAINT "service_facilities_management_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_facilities_management"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_facilities_management" ADD CONSTRAINT "service_facilities_management_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_facilities_management" ADD CONSTRAINT "service_facilities_management_support_image_id_media_id_fk" FOREIGN KEY ("support_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_facilities_management" ADD CONSTRAINT "service_facilities_management_maintenance_image_id_media_id_fk" FOREIGN KEY ("maintenance_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_facilities_management" ADD CONSTRAINT "service_facilities_management_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_dfma_facts" ADD CONSTRAINT "service_dfma_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_dfma"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_dfma_capabilities_cards" ADD CONSTRAINT "service_dfma_capabilities_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_dfma_capabilities_cards" ADD CONSTRAINT "service_dfma_capabilities_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_dfma"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_dfma_benefits_items" ADD CONSTRAINT "service_dfma_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_dfma"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_dfma" ADD CONSTRAINT "service_dfma_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_dfma" ADD CONSTRAINT "service_dfma_capabilities_image_id_media_id_fk" FOREIGN KEY ("capabilities_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_dfma" ADD CONSTRAINT "service_dfma_benefits_image_id_media_id_fk" FOREIGN KEY ("benefits_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_dfma" ADD CONSTRAINT "service_dfma_visual_image_id_media_id_fk" FOREIGN KEY ("visual_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_dfma" ADD CONSTRAINT "service_dfma_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "service_data_centre_critical_items_order_idx" ON "service_data_centre_critical_items" USING btree ("_order");
  CREATE INDEX "service_data_centre_critical_items_parent_id_idx" ON "service_data_centre_critical_items" USING btree ("_parent_id");
  CREATE INDEX "service_data_centre_testing_equipment_order_idx" ON "service_data_centre_testing_equipment" USING btree ("_order");
  CREATE INDEX "service_data_centre_testing_equipment_parent_id_idx" ON "service_data_centre_testing_equipment" USING btree ("_parent_id");
  CREATE INDEX "service_data_centre_testing_equipment_image_idx" ON "service_data_centre_testing_equipment" USING btree ("image_id");
  CREATE INDEX "service_data_centre_why_order_idx" ON "service_data_centre_why" USING btree ("_order");
  CREATE INDEX "service_data_centre_why_parent_id_idx" ON "service_data_centre_why" USING btree ("_parent_id");
  CREATE INDEX "service_data_centre_why_image_idx" ON "service_data_centre_why" USING btree ("image_id");
  CREATE INDEX "service_data_centre_hero_image_idx" ON "service_data_centre" USING btree ("hero_image_id");
  CREATE INDEX "service_data_centre_turnkey_turnkey_image_idx" ON "service_data_centre" USING btree ("turnkey_image_id");
  CREATE INDEX "service_data_centre_critical_critical_image_idx" ON "service_data_centre" USING btree ("critical_image_id");
  CREATE INDEX "service_data_centre_testing_testing_image_idx" ON "service_data_centre" USING btree ("testing_image_id");
  CREATE INDEX "service_data_centre_seo_seo_og_image_idx" ON "service_data_centre" USING btree ("seo_og_image_id");
  CREATE INDEX "service_high_tension_power_items_order_idx" ON "service_high_tension_power_items" USING btree ("_order");
  CREATE INDEX "service_high_tension_power_items_parent_id_idx" ON "service_high_tension_power_items" USING btree ("_parent_id");
  CREATE INDEX "service_high_tension_power_order_idx" ON "service_high_tension_power" USING btree ("_order");
  CREATE INDEX "service_high_tension_power_parent_id_idx" ON "service_high_tension_power" USING btree ("_parent_id");
  CREATE INDEX "service_high_tension_power_image_idx" ON "service_high_tension_power" USING btree ("image_id");
  CREATE INDEX "service_high_tension_backup_items_order_idx" ON "service_high_tension_backup_items" USING btree ("_order");
  CREATE INDEX "service_high_tension_backup_items_parent_id_idx" ON "service_high_tension_backup_items" USING btree ("_parent_id");
  CREATE INDEX "service_high_tension_backup_order_idx" ON "service_high_tension_backup" USING btree ("_order");
  CREATE INDEX "service_high_tension_backup_parent_id_idx" ON "service_high_tension_backup" USING btree ("_parent_id");
  CREATE INDEX "service_high_tension_backup_image_idx" ON "service_high_tension_backup" USING btree ("image_id");
  CREATE INDEX "service_high_tension_protection_items_order_idx" ON "service_high_tension_protection_items" USING btree ("_order");
  CREATE INDEX "service_high_tension_protection_items_parent_id_idx" ON "service_high_tension_protection_items" USING btree ("_parent_id");
  CREATE INDEX "service_high_tension_protection_order_idx" ON "service_high_tension_protection" USING btree ("_order");
  CREATE INDEX "service_high_tension_protection_parent_id_idx" ON "service_high_tension_protection" USING btree ("_parent_id");
  CREATE INDEX "service_high_tension_protection_image_idx" ON "service_high_tension_protection" USING btree ("image_id");
  CREATE INDEX "service_high_tension_hero_image_idx" ON "service_high_tension" USING btree ("hero_image_id");
  CREATE INDEX "service_high_tension_feature_feature_image_idx" ON "service_high_tension" USING btree ("feature_image_id");
  CREATE INDEX "service_high_tension_seo_seo_og_image_idx" ON "service_high_tension" USING btree ("seo_og_image_id");
  CREATE INDEX "service_project_management_services_order_idx" ON "service_project_management_services" USING btree ("_order");
  CREATE INDEX "service_project_management_services_parent_id_idx" ON "service_project_management_services" USING btree ("_parent_id");
  CREATE INDEX "service_project_management_hero_image_idx" ON "service_project_management" USING btree ("hero_image_id");
  CREATE INDEX "service_project_management_seo_seo_og_image_idx" ON "service_project_management" USING btree ("seo_og_image_id");
  CREATE INDEX "service_facilities_management_support_items_order_idx" ON "service_facilities_management_support_items" USING btree ("_order");
  CREATE INDEX "service_facilities_management_support_items_parent_id_idx" ON "service_facilities_management_support_items" USING btree ("_parent_id");
  CREATE INDEX "service_facilities_management_maintenance_items_order_idx" ON "service_facilities_management_maintenance_items" USING btree ("_order");
  CREATE INDEX "service_facilities_management_maintenance_items_parent_id_idx" ON "service_facilities_management_maintenance_items" USING btree ("_parent_id");
  CREATE INDEX "service_facilities_management_why_order_idx" ON "service_facilities_management_why" USING btree ("_order");
  CREATE INDEX "service_facilities_management_why_parent_id_idx" ON "service_facilities_management_why" USING btree ("_parent_id");
  CREATE INDEX "service_facilities_management_why_image_idx" ON "service_facilities_management_why" USING btree ("image_id");
  CREATE INDEX "service_facilities_management_hero_image_idx" ON "service_facilities_management" USING btree ("hero_image_id");
  CREATE INDEX "service_facilities_management_support_support_image_idx" ON "service_facilities_management" USING btree ("support_image_id");
  CREATE INDEX "service_facilities_management_maintenance_maintenance_im_idx" ON "service_facilities_management" USING btree ("maintenance_image_id");
  CREATE INDEX "service_facilities_management_seo_seo_og_image_idx" ON "service_facilities_management" USING btree ("seo_og_image_id");
  CREATE INDEX "service_dfma_facts_order_idx" ON "service_dfma_facts" USING btree ("_order");
  CREATE INDEX "service_dfma_facts_parent_id_idx" ON "service_dfma_facts" USING btree ("_parent_id");
  CREATE INDEX "service_dfma_capabilities_cards_order_idx" ON "service_dfma_capabilities_cards" USING btree ("_order");
  CREATE INDEX "service_dfma_capabilities_cards_parent_id_idx" ON "service_dfma_capabilities_cards" USING btree ("_parent_id");
  CREATE INDEX "service_dfma_capabilities_cards_image_idx" ON "service_dfma_capabilities_cards" USING btree ("image_id");
  CREATE INDEX "service_dfma_benefits_items_order_idx" ON "service_dfma_benefits_items" USING btree ("_order");
  CREATE INDEX "service_dfma_benefits_items_parent_id_idx" ON "service_dfma_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "service_dfma_hero_image_idx" ON "service_dfma" USING btree ("hero_image_id");
  CREATE INDEX "service_dfma_capabilities_capabilities_image_idx" ON "service_dfma" USING btree ("capabilities_image_id");
  CREATE INDEX "service_dfma_benefits_benefits_image_idx" ON "service_dfma" USING btree ("benefits_image_id");
  CREATE INDEX "service_dfma_visual_visual_image_idx" ON "service_dfma" USING btree ("visual_image_id");
  CREATE INDEX "service_dfma_seo_seo_og_image_idx" ON "service_dfma" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "service_data_centre_critical_items" CASCADE;
  DROP TABLE "service_data_centre_testing_equipment" CASCADE;
  DROP TABLE "service_data_centre_why" CASCADE;
  DROP TABLE "service_data_centre" CASCADE;
  DROP TABLE "service_high_tension_power_items" CASCADE;
  DROP TABLE "service_high_tension_power" CASCADE;
  DROP TABLE "service_high_tension_backup_items" CASCADE;
  DROP TABLE "service_high_tension_backup" CASCADE;
  DROP TABLE "service_high_tension_protection_items" CASCADE;
  DROP TABLE "service_high_tension_protection" CASCADE;
  DROP TABLE "service_high_tension" CASCADE;
  DROP TABLE "service_project_management_services" CASCADE;
  DROP TABLE "service_project_management" CASCADE;
  DROP TABLE "service_facilities_management_support_items" CASCADE;
  DROP TABLE "service_facilities_management_maintenance_items" CASCADE;
  DROP TABLE "service_facilities_management_why" CASCADE;
  DROP TABLE "service_facilities_management" CASCADE;
  DROP TABLE "service_dfma_facts" CASCADE;
  DROP TABLE "service_dfma_capabilities_cards" CASCADE;
  DROP TABLE "service_dfma_benefits_items" CASCADE;
  DROP TABLE "service_dfma" CASCADE;`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_why_us_cards" DROP COLUMN "icon";
  DROP TYPE "public"."enum_landing_why_us_cards_icon";
  ALTER TABLE "landing_why_us_cards" ADD COLUMN "icon_id" integer;
  ALTER TABLE "landing_why_us_cards" ADD CONSTRAINT "landing_why_us_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "landing_why_us_cards_icon_idx" ON "landing_why_us_cards" USING btree ("icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_why_us_cards" DROP CONSTRAINT "landing_why_us_cards_icon_id_media_id_fk";
  DROP INDEX "landing_why_us_cards_icon_idx";
  ALTER TABLE "landing_why_us_cards" DROP COLUMN "icon_id";
  CREATE TYPE "public"."enum_landing_why_us_cards_icon" AS ENUM('ClockCountdown', 'UsersThree', 'Bank', 'Handshake', 'Wrench', 'ShieldCheck', 'Certificate', 'Leaf', 'Buildings', 'Lightning', 'ChartLineUp', 'Target', 'Globe', 'Gear', 'Star', 'CheckCircle');
  ALTER TABLE "landing_why_us_cards" ADD COLUMN "icon" "public"."enum_landing_why_us_cards_icon";`)
}

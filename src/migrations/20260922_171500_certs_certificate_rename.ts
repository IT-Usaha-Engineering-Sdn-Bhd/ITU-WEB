import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_certs_items" RENAME COLUMN "logo_id" TO "certificate_id";
  ALTER TABLE "landing_certs_items" RENAME CONSTRAINT "landing_certs_items_logo_id_media_id_fk" TO "landing_certs_items_certificate_id_media_id_fk";
  ALTER INDEX "landing_certs_items_logo_idx" RENAME TO "landing_certs_items_certificate_idx";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_certs_items" RENAME COLUMN "certificate_id" TO "logo_id";
  ALTER TABLE "landing_certs_items" RENAME CONSTRAINT "landing_certs_items_certificate_id_media_id_fk" TO "landing_certs_items_logo_id_media_id_fk";
  ALTER INDEX "landing_certs_items_certificate_idx" RENAME TO "landing_certs_items_logo_idx";`)
}

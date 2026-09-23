import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const tables = [
  'service_data_centre_critical_items',
  'service_high_tension_power_items',
  'service_high_tension_backup_items',
  'service_high_tension_protection_items',
  'service_project_management_services',
  'service_facilities_management_support_items',
  'service_facilities_management_maintenance_items',
  'service_dfma_capabilities_cards',
  'service_dfma_benefits_items',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of tables) {
    await db.execute(sql.raw(`ALTER TABLE "${table}" ADD COLUMN "icon_id" integer`))
    await db.execute(
      sql.raw(
        `ALTER TABLE "${table}" ADD CONSTRAINT "${table}_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`,
      ),
    )
    await db.execute(sql.raw(`CREATE INDEX "${table}_icon_idx" ON "${table}" USING btree ("icon_id")`))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of [...tables].reverse()) {
    await db.execute(sql.raw(`ALTER TABLE "${table}" DROP CONSTRAINT "${table}_icon_id_media_id_fk"`))
    await db.execute(sql.raw(`DROP INDEX "${table}_icon_idx"`))
    await db.execute(sql.raw(`ALTER TABLE "${table}" DROP COLUMN "icon_id"`))
  }
}

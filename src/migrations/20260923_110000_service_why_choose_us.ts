import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const pages = ['service_project_management', 'service_dfma'] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const page of pages) {
    const table = `${page}_why`
    await db.execute(
      sql.raw(
        `CREATE TABLE "${table}" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "body" varchar NOT NULL, "image_id" integer)`,
      ),
    )
    await db.execute(
      sql.raw(
        `ALTER TABLE "${table}" ADD CONSTRAINT "${table}_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`,
      ),
    )
    await db.execute(
      sql.raw(
        `ALTER TABLE "${table}" ADD CONSTRAINT "${table}_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."${page}"("id") ON DELETE cascade ON UPDATE no action`,
      ),
    )
    await db.execute(sql.raw(`CREATE INDEX "${table}_order_idx" ON "${table}" USING btree ("_order")`))
    await db.execute(sql.raw(`CREATE INDEX "${table}_parent_id_idx" ON "${table}" USING btree ("_parent_id")`))
    await db.execute(sql.raw(`CREATE INDEX "${table}_image_idx" ON "${table}" USING btree ("image_id")`))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const page of [...pages].reverse()) {
    await db.execute(sql.raw(`DROP TABLE "${page}_why"`))
  }
}

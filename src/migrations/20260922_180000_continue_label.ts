import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing" ALTER COLUMN "hero_learn_more_label" SET DEFAULT 'Continue';
  UPDATE "landing" SET "hero_learn_more_label" = 'Continue' WHERE "hero_learn_more_label" = 'Learn More';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing" ALTER COLUMN "hero_learn_more_label" SET DEFAULT 'Learn More';
  UPDATE "landing" SET "hero_learn_more_label" = 'Learn More' WHERE "hero_learn_more_label" = 'Continue';`)
}

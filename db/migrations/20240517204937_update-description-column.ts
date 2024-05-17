import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("meals", (table) => {
    table.text("description").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("meals", (table) => {
    table.string("description").notNullable().alter();
  });
}

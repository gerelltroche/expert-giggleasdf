/**
 * Migration file to add a 'pronouns' column to the `authors` table
 */

import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.table("authors", (table) => {
    table.string("pronouns").nullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.table("authors", (table) => {
    table.dropColumn("pronouns");
  });
}
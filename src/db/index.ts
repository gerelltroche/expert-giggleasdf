/**
 * Database client
 * It's essentially a wrapper around Knex https://knexjs.org/
 */

import initKnex, { Knex } from "knex";

import config from "./config";
import type { Author } from "./types";

export * from "./types";

export class Db {
  private knex: Knex;

  constructor() {
    this.knex = initKnex(config.development);
  }

  public listAuthors() {
    return this.knex.table<Author>("authors").select("*").limit(10);
  }

  public getAuthorById(id: number) {
    return this.knex.table<Author>("authors").select("*").where("id", id).first();
  }

public async addAuthor(author: Omit<Author, 'id'>) {
  const [id] = await this.knex.table<Author>("authors")
    .insert(author)
    .returning<number[]>('id');
  return this.getAuthorById(id);
}

public async updateAuthor(id: number, authorUpdates: Partial<Omit<Author, 'id'>>) {
  const [updatedId] = await this.knex.table<Author>("authors")
    .where("id", id)
    .update(authorUpdates)
    .returning<number[]>('id');
  return this.getAuthorById(updatedId);
}
}

export default new Db();

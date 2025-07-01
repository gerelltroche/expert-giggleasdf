/**
 * Graph definitions and corresponding resolvers
 */

import { gql } from "graphql-tag";
import { Context } from "../types";
import { Db, Author } from "../db";
import Countries from "../lib/Countries";

const db = new Db();
const countries = new Countries();

export const typeDefs = gql`
  type Author {
    id: ID!
    givenName: String!
    familyName: String!
    displayName: String!
    country: Country
  }

  type Country {
    cca2: String!
    name: String!
  }

  type Query {
    authors: [Author!]!
    author(id: ID!): Author
    countries: [Country!]!
  }
`;

const countriesWithFamilyNameFirst = ["JP"];

export const resolvers = {
  Author: {
    displayName: (author: Author & { countryCode?: string }) => {
      if (countriesWithFamilyNameFirst.includes(author.countryCode)) {
        return `${author.familyName} ${author.givenName}`;
      }
      return `${author.givenName} ${author.familyName}`;
    },
    country: (author: Author) => {
      if (!author.countryCode) {
        return null;
      }
      return countries.findByCode(author.countryCode);
    },
  },

  Query: {
    authors: (parent: unknown, args: unknown, context: Context) => {
      return db.listAuthors();
    },
    author: (parent: unknown, args: { id: string }, context: Context) => {
      return db.getAuthorById(parseInt(args.id, 10));
    },
    countries: () => {
      return countries.getAll();
    },
  },
};

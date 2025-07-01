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
    countries: [Country!]!
  }
`;

export const resolvers = {
  Author: {
    displayName: (author: Author) => `${author.givenName} ${author.familyName}`,
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
    countries: () => {
      return countries.getAll();
    },
  },
};

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
    pronouns: String
  }

  type Country {
    cca2: String!
    name: String!
  }

  input AuthorInput {
    givenName: String!
    familyName: String!
    pronouns: String!
    countryCode: String
  }

  input AuthorUpdateInput {
    givenName: String
    familyName: String
    pronouns: String
    countryCode: String
  }

  type Mutation {
    addAuthor(input: AuthorInput!): Author!
    editAuthor(id: ID!, input: AuthorUpdateInput!): Author!
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
    authors: (_parent: unknown, _args: unknown, _context: Context) => {
      return db.listAuthors();
    },
    author: (_parent: unknown, args: { id: string }, _context: Context) => {
      return db.getAuthorById(parseInt(args.id, 10));
    },
    countries: () => {
      return countries.getAll();
    },
  },

  Mutation: {
    addAuthor: (_parent: unknown, args: { input: { givenName: string; familyName: string; pronouns: string; countryCode?: string } }, _context: Context) => {
      return db.addAuthor({
        givenName: args.input.givenName,
        familyName: args.input.familyName,
        pronouns: args.input.pronouns,
        countryCode: args.input.countryCode || null
      });
    },
    editAuthor: (_parent: unknown, args: { id: string; input: { givenName?: string; familyName?: string; pronouns?: string; countryCode?: string } }, _context: Context) => {
      return db.updateAuthor(parseInt(args.id), args.input);
    },
  },
};

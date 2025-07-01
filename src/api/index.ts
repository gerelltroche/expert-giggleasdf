/**
 * Graph definitions and corresponding resolvers
 */

import { gql } from "graphql-tag";
import { Context } from "../types";
import { Db } from "../db";

const db = new Db();

export const typeDefs = gql`
  type Author {
    id: ID!
    givenName: String!
    familyName: String!
  }

  type Query {
    authors: [Author!]!
  }
`;

export const resolvers = {
  Query: {
    authors: (parent, args, context: Context) => {
      return db.listAuthors();
    },
  },
};

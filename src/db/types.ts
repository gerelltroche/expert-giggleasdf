/**
 * Typings of data stored in DB
 */

export type Author = {
  id: number;
  givenName: string;
  familyName: string;
  pronouns: string;
  countryCode: string | null; // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
};

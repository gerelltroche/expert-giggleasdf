/**
 * A client for a public API providing information about countries.
 * Documentation available here: https://restcountries.com/
 */

/**
 * Axios is used as HTTP client
 * https://www.npmjs.com/package/axios
 */
import axios from "axios";

/**
 * Typing for data returned by endpoints of https://restcountries.com/
 * This is a partial, work in progress, implementation of said typing.
 */
interface Country {
  cca2: string;
  name: string;
}

/**
 * Typing for data returned by endpoints of https://restcountries.com/
 * This is a partial, work in progress, implementation of said typing.
 */
interface ApiCountry {
  cca2: string; // 2-letter code https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
  name: {
    common: string;
  };
}

export default class Countries {
  private restApi = axios.create({
    baseURL: "https://restcountries.com/v3.1",
  });

  private countries: Map<string, Country> = new Map();

  /**
   * Populates the map of countries for lookups.
   * It is safe to call this method multiple times.
   */
  private async populate() {
    if (this.countries.size > 0) {
      return;
    }

    const { data } = await this.restApi.get<ApiCountry[]>(
      "/all?fields=name,cca2"
    );
    for (const country of data) {
      this.countries.set(country.cca2, {
        cca2: country.cca2,
        name: country.name.common,
      });
    }
  }

  /**
   * Example of how to query the rest API.
   * @param name Country name to search for
   * @returns List of countries matching searched term
   */
  public async searchByName(name: string) {
    const { data } = await this.restApi.get<Country[]>(
      `/name/${encodeURIComponent(name)}`
    );

    return data;
  }

  // 🗺 Add your method(s) here
  public async getAll() {
    await this.populate();
    return Array.from(this.countries.values());
  }

  public async findByCode(code: string) {
    await this.populate();
    return this.countries.get(code);
  }
}

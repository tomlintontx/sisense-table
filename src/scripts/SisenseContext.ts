import type { JAQL } from "./JAQLSpecification";

export class SisenseContext {
  baseUrl: string;
  private _token: string | undefined;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async query(jaql: JAQL): Promise<object> {
    return fetch(`${this.baseUrl}/api/datasources/x/jaql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._token}`,
      },
      body: JSON.stringify(jaql),
    }).then((r) => r.json());
  }

  async getFields(datasource: string): Promise<string[]> {
    return fetch(
      `${this.baseUrl}/api/datasources/${datasource}/fields/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        body: JSON.stringify({
          count: 100,
          offset: 0,
        }),
      }
    )
      .then((r: Response) => r.json())
      .then((r: any) => r.map((i: any) => i.id));
  }

  async login(username: string, password: string): Promise<void> {
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    await fetch(`${this.baseUrl}/api/v1/authentication/login`, {
      method: "POST",
      body,
    })
      .then((r) => r.json())
      .then((r) => (this._token = r.access_token))
      .catch((e) => console.log(e));
  }

  loginWithToken(token: string) {
    this._token = token;
  }

}

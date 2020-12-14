export class User {
  public userId: string;
  public name: string;

  constructor(data: any = {}) {
    this.userId = data.userId ?? ''
    this.name = data.name ?? ''
  }

  public static generateFromAPI(response: any = {}): User {
    return new User(response)
  }
}
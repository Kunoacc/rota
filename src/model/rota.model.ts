import { RotaType } from './rota-type.enum'
import { User } from './user.model';


export class Rota {
  public userId: string;
  public user: User;
  public type: RotaType;
  public date: string;

  constructor(data: any = {}) {
    this.userId = data.userId ?? ''
    this.user = data.user ?? null
    this.type = data.type ?? null
    this.date = data.date ?? ''
  }

  public static generateFromAPI(response: any = {}): Rota {
    return new Rota(response)
  }
}
import { User } from './user.model'
import { Rota } from './rota.model'

export class RotaList {
  public rotaId: string;
  public rotaPeriod: {
    startDate: string;
    endDate: string;
  };
  public rotas: Rota[];

  constructor(data: any = {}) {
    this.rotaId = data.rotaId ?? ''
    this.rotaPeriod = data.rotaPeriod ?? null
    this.rotas = data.rotas ?? []
  }

  public static generateFromAPI(response: {
    rotaData: any;
    userMap: Record<string, User>;
  }): RotaList {
    const rotaList = (response?.rotaData?.rota || []).map((rota: any) => {
      return Rota.generateFromAPI({
        ...rota,
        user: response?.userMap[rota?.userId]
      });
    });
    
    return new RotaList({
      rotaId: response?.rotaData?.rotaID,
      rotaPeriod: response?.rotaData?.period,
      rotas: rotaList
    })
  }
}
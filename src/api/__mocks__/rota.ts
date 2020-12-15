import { RotaList } from '@/model/rota-list.model'
import { User } from '@/model/user.model'
import { ROTA_LIST, USERS } from '@/../tests/store-config'

export default {
  async getRotaList(): Promise<RotaList[]> {
    return new Promise((resolve) => resolve(ROTA_LIST))
  },

  async getUserList(): Promise<User[]> {
    return new Promise((resolve) => resolve(USERS))
  },

  async getRota(userMap: Record<string, User>, rotaId?: number | string): Promise<RotaList> {
    return new Promise((resolve) => resolve(RotaList.generateFromAPI({
      rotaData: ROTA_LIST.filter(rota => rota.rotaId === rotaId)[0],
      userMap
    })));
  },

  async getNewRota(): Promise<RotaList> {
    return new Promise((resolve) => resolve({
      ...ROTA_LIST[0],
      rotaId: "13"
    } as RotaList));
  }
}
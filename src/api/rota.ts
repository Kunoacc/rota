import { RotaList } from '@/model/rota-list.model'
import { Rota } from '@/model/rota.model'
import { User } from '@/model/user.model'
import { UserUtil } from '@/utils/user.util'
import { http } from '@/utils/http.util'
import { DEFAULT_API_ERROR_RESPONSE, DEFAULT_API_SUCCESS_RESPONSE } from '@/constants'

export default {
  async getRotaList(): Promise<RotaList[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await http<{
          users: User[],
          rotas: RotaList[]
        }>('rotas');
        const userList = response.parsedBody?.users ?? [];
        const rotaDataList = response.parsedBody?.rotas ?? [];

        const userMap = UserUtil.createUserMapFromList(userList);
        const rotaList: RotaList[] = rotaDataList.map((rotaData: any) => {
          return RotaList.generateFromAPI({
            rotaData, userMap
          });
        });

        resolve(rotaList);
      } catch (error) {
        reject( error ?? 'An error occured, please try again later');
      }
    })
  },

  async getUserList(): Promise<User[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await http<User[]>('users');
        const userDataList = response.parsedBody ?? [];
        const userList: User[] = userDataList.map((userData: any) => {
          return User.generateFromAPI(userData)
        });

        resolve(userList);
      } catch(error) {
        reject(error ?? 'An error occurred while fetching users, please try again later.');
      }
    })
  },

  async getRota(userMap: Record<string, User>, rotaId?: number | string): Promise<RotaList> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await http<RotaList>(`rota/${rotaId}`);
        const rota: RotaList = RotaList.generateFromAPI({
          rotaData: response.parsedBody,
          userMap
        });

        resolve(rota);
      } catch (error) {
        reject(error ?? 'An error occurred while getting the rota, please try again');
      }
    })
  },

  async getNewRota(userList?: User[]): Promise<RotaList> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await http<{
          status: string,
          rotaId: string | number
        }>('generate');

        const newRotaId = response.parsedBody?.rotaId
        userList = (userList || await this.getUserList()) as User[];
        const userMap = UserUtil.createUserMapFromList(userList)
        const newRota = await this.getRota(userMap, newRotaId)

        resolve(newRota);
      } catch(error) {
        reject(error ?? DEFAULT_API_ERROR_RESPONSE)
      }
    })
  }
}
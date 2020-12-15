import { RotaList } from '@/model/rota-list.model'
import { User } from '@/model/user.model'
import { UserUtil } from '@/utils/user.util'
import { http } from '@/utils/http.util'
import { DEFAULT_API_ERROR_RESPONSE } from '@/constants'

export default {
  async getRotaList(): Promise<RotaList[]> {
    try {
      const response = await http<{
        users: User[];
        rotas: RotaList[];
      }>('rotas');
      const userList = response.parsedBody?.users ?? [];
      const rotaDataList = response.parsedBody?.rotas ?? [];

      const userMap = UserUtil.createUserMapFromList(userList);
      const rotaList: RotaList[] = rotaDataList.map((data: any) => {
        return RotaList.generateFromAPI({
          rotaData: data,
          userMap
        });
      });

      return rotaList;
    } catch (error) {
      throw new Error( error?.message ?? 'An error occured, please try again later');
    }
  },

  async getUserList(): Promise<User[]> {
    try {
      const response = await http<{
        users: User[];
      }>('users');
      const userDataList = response.parsedBody?.users ?? [];
      const userList: User[] = userDataList.map((userData: any) => {
        return User.generateFromAPI(userData)
      });
      return userList;
    } catch(error) {
      throw new Error(error?.message ?? 'An error occurred while fetching users, please try again later.');
    }
  },

  async getRota(userMap: Record<string, User>, rotaId?: number | string): Promise<RotaList> {
    try {
      const response = await http<RotaList>(`rota/${rotaId}`);
      const rota: RotaList = RotaList.generateFromAPI({
        rotaData: response?.parsedBody,
        userMap
      });
      
      return rota;
    } catch (error) {
      throw new Error(error?.message ?? 'An error occurred while getting the rota, please try again');
    }
  },

  async getNewRota(): Promise<RotaList> {
    try {
      const response = await http<{
        status: string;
        rotaId: string | number;
      }>('generate');

      const newRotaId = response.parsedBody?.rotaId;
      const userList: User[] = await this.getUserList();

      const userMap = UserUtil.createUserMapFromList(userList);
      const newRota = await this.getRota(userMap, newRotaId);

      return newRota;
    } catch(error) {
      throw new Error(error?.message ?? DEFAULT_API_ERROR_RESPONSE)
    }
  }
}
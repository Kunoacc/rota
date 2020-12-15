import { RotaList } from '@/model/rota-list.model'
import { User } from '@/model/user.model'
import api from '@/api'
import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import { DEFAULT_API_ERROR_RESPONSE, DEFAULT_MESSAAGE_TIMEOUT } from '@/constants'

Vue.use(Vuex)

export interface Store {
  rotaList: RotaList[];
  userList: User[];
  activeUser: undefined | User;
  userListLoading: boolean;
  rotaListLoading: boolean;
  newRotaLoading: boolean;
  success: undefined | string;
  error: undefined | string;
}

export const state: Store = {
  rotaList: [] as RotaList[],
  userList: [] as User[],
  activeUser: undefined as unknown as User,
  userListLoading: false,
  rotaListLoading: false,
  newRotaLoading: false,
  success: null as unknown as string,
  error: null as unknown as string
};

export const mutations = {
  SET_ROTA_LIST(state: Store, newRotaList: RotaList[]) {
    state.rotaList = newRotaList
  },
  SET_USER_LIST(state: Store, userList: User[]) {
    state.userList = userList
  },
  SET_SUCCESS(state: Store, success?: string) {
    state.success = success
  },
  SET_ERROR(state: Store, error?: string) {
    state.error = error
  },
  SET_ACTIVE_USER(state: Store, activeUser?: User){
    state.activeUser = activeUser
  },
  SET_USER_LIST_LOADING(state: Store, isUserListLoading: boolean) {
    state.userListLoading = isUserListLoading
  },
  SET_ROTA_LIST_LOADING(state: Store, isRotaListLoading: boolean) {
    state.rotaListLoading = isRotaListLoading
  },
  SET_NEW_ROTA_LOADING(state: Store, isNewRotaLoading: boolean) {
    state.newRotaLoading = isNewRotaLoading
  }
};

export const actions = {
  async loadRotaList({ commit }: ActionContext<Store, Store>) {
    commit('SET_ROTA_LIST_LOADING', true)

    try {
      const rotaList = await api.getRotaList()
      commit('SET_ROTA_LIST', rotaList)
    } catch (err) {
      commit('SET_ERROR', err?.message || DEFAULT_API_ERROR_RESPONSE)
      setTimeout(() => commit('SET_ERROR', ''), DEFAULT_MESSAAGE_TIMEOUT)
    } finally {
      commit('SET_ROTA_LIST_LOADING', false)
    }
  },

  async loadUserList({ commit }: ActionContext<Store, Store>) {
    commit('SET_USER_LIST_LOADING', true)

    try {
      const userList = await api.getUserList()
      commit('SET_USER_LIST', userList)
    } catch (err) {
      commit('SET_ERROR', err?.message || DEFAULT_API_ERROR_RESPONSE)
      setTimeout(() => commit('SET_ERROR', ''), DEFAULT_MESSAAGE_TIMEOUT)
    } finally {
      commit('SET_USER_LIST_LOADING', false)
    }
  },

  async generateNewRota({ commit, state }: ActionContext<Store, Store>) {
    commit('SET_NEW_ROTA_LOADING', true)

    try {
      const newRota = await api.getNewRota();
      const newRotaExistsInStore = state.rotaList.findIndex(rota => rota.rotaId === newRota.rotaId) > -1

      if (newRotaExistsInStore) {
        throw new Error(`Rota ${newRota.rotaId} already exists`)
      }

      const updatedRotaList = [...state.rotaList, newRota]
      commit('SET_ROTA_LIST', updatedRotaList)
      commit('SET_SUCCESS', 'New rota generated')
      setTimeout(() => commit('SET_SUCCESS', ''), DEFAULT_MESSAAGE_TIMEOUT)

    } catch(err) {
      commit('SET_ERROR', err?.message || DEFAULT_API_ERROR_RESPONSE)
      setTimeout(() => commit('SET_ERROR', ''), DEFAULT_MESSAAGE_TIMEOUT)
    } finally {
      commit('SET_NEW_ROTA_LOADING', false);
    }
  },

  setActiveUser({ commit }: ActionContext<Store, Store>, user?: User) {
    commit('SET_ACTIVE_USER', user)
  }
};

export const getters = {
  getUserRotas: (state: Store) => {
    return state.rotaList.map(rota => ({
      ...rota,
      rotas: rota.rotas.filter(rotaData => rotaData?.userId === state.activeUser?.userId)
    })
    ).filter(rota => rota.rotas.length > 0)
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

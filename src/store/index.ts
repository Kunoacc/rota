import { RotaList } from '@/model/rota-list.model'
import { User } from '@/model/user.model'
import api from '@/api'
import Vue from 'vue'
import Vuex from 'vuex'
import { DEFAULT_API_ERROR_RESPONSE } from '@/constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rotaList: [] as RotaList[],
    userList: [] as User[],
    activeUser: null as unknown as User,
    userListLoading: false,
    rotaListLoading: false,
    newRotaLoading: false,
    success: null as unknown as string,
    error: null as unknown as string
  },
  mutations: {
    SET_ROTA_LIST(state, newRotaList) {
      state.rotaList = newRotaList
    },
    SET_USER_LIST(state, userList) {
      state.userList = userList
    },
    SET_SUCCESS(state, success) {
      state.success = success
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_ACTIVE_USER(state, activeUser){
      state.activeUser = activeUser
    },
    SET_USER_LIST_LOADING(state, isUserListLoading) {
      state.userListLoading = isUserListLoading
    },
    SET_ROTA_LIST_LOADING(state, isRotaListLoading) {
      state.rotaListLoading = isRotaListLoading
    },
    SET_NEW_ROTA_LOADING(state, isNewRotaLoading) {
      state.newRotaLoading = isNewRotaLoading
    }
  },
  actions: {
    async loadRotaList({ commit }) {
      commit('SET_ROTA_LIST_LOADING', true)

      try {
        const rotaList = await api.getRotaList()
        commit('SET_ROTA_LIST', rotaList)
      } catch (err) {
        commit('SET_ERROR', err || DEFAULT_API_ERROR_RESPONSE)
      } finally {
        commit('SET_ROTA_LIST_LOADING', false)
      }
    },

    async loadUserList({ commit }) {
      commit('SET_USER_LIST_LOADING', true)

      try {
        const userList = await api.getUserList()
        commit('SET_USER_LIST', userList)
      } catch (err) {
        commit('SET_ERROR', err || DEFAULT_API_ERROR_RESPONSE)
      } finally {
        commit('SET_USER_LIST_LOADING', false)
      }
    },

    async generateNewRota({ commit, state }) {
      commit('SET_NEW_ROTA_LOADING', true)

      try {
        const newRota = await api.getNewRota();
        const newRotaExistsInStore = state.rotaList.findIndex(rota => rota.rotaId === newRota.rotaId) > -1

        if (newRotaExistsInStore) {
          throw new Error('Error generating rota')
        }

        const updatedRotaList = [...state.rotaList, newRota]
        commit('SET_ROTA_LIST', updatedRotaList)
        commit('SET_SUCCESS', 'New rota generated')
      } catch(err) {
        commit('SET_ERROR', err || DEFAULT_API_ERROR_RESPONSE)
      } finally {
        commit('SET_NEW_ROTA_LOADING', false);
      }
    },

    setActiveUser({ commit }, user?: User) {
      commit('SET_ACTIVE_USER', user)
    }
  },

  getters: {
    getUserRotas: (state) => {
      return state.rotaList.reduce((userRotaList, rota) => {
        const tempRota = rota;
        tempRota.rotas = tempRota.rotas.filter(rotaData => rotaData.userId === state.activeUser.userId);

        if (tempRota.rotas.length > 0) {
          userRotaList.push(tempRota)
        }

        return userRotaList;
      }, [] as RotaList[]);
    }
  }
})

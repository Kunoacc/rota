import { mutations, Store } from '@/store'
import StoreConfig, { ROTA_LIST, USERS } from '../store-config'

const { SET_ROTA_LIST, SET_ROTA_LIST_LOADING ,SET_USER_LIST, SET_USER_LIST_LOADING, SET_NEW_ROTA_LOADING } = mutations;

describe('Testing mutations', () => {

  it('Sets rota list', () => {
    const state: Store = StoreConfig.state
    SET_ROTA_LIST(state, ROTA_LIST)
    expect(state.rotaList).toEqual(ROTA_LIST)
  })

  it('Toggles rota list loading state', () => {
    const state: Store = StoreConfig.state
    SET_ROTA_LIST_LOADING(state, false)
    expect(state.rotaListLoading).toEqual(false)
    
    SET_ROTA_LIST_LOADING(state, true)
    expect(state.rotaListLoading).toEqual(true)
  })

  it('Sets user list', () => {
    const state: Store = StoreConfig.state
    SET_USER_LIST(state, USERS)
    expect(state.userList).toEqual(USERS)
  })

  it('Toggles user list loading state', () => {
    const state: Store = StoreConfig.state
    SET_USER_LIST_LOADING(state, false)
    expect(state.userListLoading).toEqual(false)

    SET_USER_LIST_LOADING(state, true)
    expect(state.userListLoading).toEqual(true)
  })

  it('Toggles new rota loading state', () => {
    const state: Store = StoreConfig.state
    SET_NEW_ROTA_LOADING(state, false)
    expect(state.newRotaLoading).toEqual(false)

    SET_NEW_ROTA_LOADING(state, true)
    expect(state.newRotaLoading).toEqual(true)
  })
})


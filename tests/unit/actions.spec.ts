jest.mock('@/api', () => require('@/api/__mocks__'))

import { Store as Str } from '@/store'
import StoreConfig, { ROTA_LIST ,USERS } from '../store-config'
import vuex, { Store } from 'vuex'
import { cloneDeep } from 'lodash'
import { createLocalVue } from '@vue/test-utils'
import { VueConstructor } from 'vue/types/umd'
import { RotaList } from '@/model/rota-list.model'

describe('Testing Actions', () => {
  let localVue: VueConstructor;
  let store: Store<Str>;
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(vuex)
    store = new vuex.Store(cloneDeep(StoreConfig))
  })

  it('Loads list of complex rotas', async () => {
    expect(store.state.rotaList).toEqual([])
    await store.dispatch('loadRotaList')
    expect(store.state.rotaList).toEqual(ROTA_LIST)
  })

  it('Loads user list', async () => {
    expect(store.state.userList).toEqual([])
    await store.dispatch('loadUserList')
    expect(store.state.userList).toEqual(USERS)
  })

  it('Sets active user', async () => {
    expect(store.state.activeUser).toEqual({})
    await store.dispatch('setActiveUser', USERS[0])
    expect(store.state.activeUser).toEqual(USERS[0])
  })

  it('Generates new rota', async () => {
    expect(store.state.rotaList).toEqual([])
    await store.dispatch('loadRotaList')
    expect(store.state.rotaList).toEqual(ROTA_LIST)
    await store.dispatch('generateNewRota')
    expect(store.state.rotaList).toEqual([...ROTA_LIST, {
      ...ROTA_LIST[0],
      rotaId: "13"
    } as RotaList])
  })

  
})
import { RotaList } from '@/model/rota-list.model';
import { RotaType } from '@/model/rota-type.enum';
import { getters, Store } from '@/store'
import StoreConfig, { ROTA_LIST, USERS } from '../store-config'

const { getUserRotas } = getters;

describe('Testing getters', () => {
  
  it('Filters active users rotas', () => {
    const state: Store = StoreConfig.state

    state.activeUser = USERS[0]
    state.rotaList = ROTA_LIST
    const filteredRota: RotaList[] = [
      {
        "rotaId": "12",
        "rotaPeriod": {
          "startDate": "2020-11-11",
          "endDate": "2020-11-13"
        },
        "rotas": [
          {
            "user": USERS[0],
            "type": RotaType.afternoon,
            "date": "2020-11-11",
            "userId": USERS[0].userId
          },
        ]
      }
    ]

    expect(getUserRotas(state)).toEqual(filteredRota)
  })
})
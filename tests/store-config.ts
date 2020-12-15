import { RotaList } from '@/model/rota-list.model'
import { RotaType } from '@/model/rota-type.enum'
import { User } from '@/model/user.model'
import { Store, getters, mutations, actions } from '@/store'

export const USERS: User[] = [
  {
    "userId": "1",
    "name": "John Smith"
  },
  {
    "userId": "2",
    "name": "Ann Doe"
  },
  {
    "userId": "3",
    "name": "Nicole Woo"
  },
  {
    "userId": "4",
    "name": "Bo Derek"
  },
  {
    "userId": "5",
    "name": "Titan Cox"
  },
  {
    "userId": "6",
    "name": "Peter Pan"
  },
  {
    "userId": "7",
    "name": "Jake Smith"
  },
  {
    "userId": "8",
    "name": "Blake Dee"
  },
  {
    "userId": "9",
    "name": "Joana Li"
  },
  {
    "userId": "10",
    "name": "Beef Patty"
  }
]

export const ROTA_LIST: RotaList[] = [
  {
    "rotaId": "11",
    "rotaPeriod": {
      "startDate": "2020-11-08",
      "endDate": "2020-11-10"
    },
    "rotas": [
      {
        "user": USERS[9],
        "type": RotaType.afternoon,
        "date": "2020-11-08",
        "userId": USERS[9].userId
      },
      {
        "user": USERS[8],
        "type": RotaType.morning,
        "date": "2020-11-08",
        "userId": USERS[8].userId
      },
      {
        "user": USERS[7],
        "type": RotaType.morning,
        "date": "2020-11-09",
        "userId": USERS[7].userId
      },
      {
        "user": USERS[6],
        "type": RotaType.afternoon,
        "date": "2020-11-09",
        "userId": USERS[6].userId
      },
      {
        "user": USERS[5],
        "type": RotaType.morning,
        "date": "2020-11-10",
        "userId": USERS[5].userId
      },
    ]
  },
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
      {
        "user": USERS[1],
        "type": RotaType.morning,
        "date": "2020-11-11",
        "userId": USERS[1].userId
      },
      {
        "user": USERS[4],
        "type": RotaType.morning,
        "date": "2020-11-12",
        "userId": USERS[4].userId
      },
      {
        "user": USERS[2],
        "type": RotaType.afternoon,
        "date": "2020-11-12",
        "userId": USERS[2].userId
      },
      {
        "user": USERS[3],
        "type": RotaType.morning,
        "date": "2020-11-13",
        "userId": USERS[3].userId
      },
    ]
  }
]

export default {
  state: {
    error: undefined,
    success: undefined,
    activeUser: {} as User,
    newRotaLoading: false,
    rotaList: [] as RotaList[],
    userList: [] as User[],
    rotaListLoading: false,
    userListLoading: false
  } as Store,
  actions,
  getters,
  mutations
}
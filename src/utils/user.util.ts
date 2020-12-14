import { User } from '../model/user.model'

export class UserUtil {
  public static createUserMapFromList(userList: any[] = []): Record<string, User> {
    const userMap: Record<string, User> = (userList).reduce((userListMap, user) => {
      userListMap[user.userId] = new User(user)
      return userListMap
    }, {} as Record<string, User>)

    return userMap;
  }
}
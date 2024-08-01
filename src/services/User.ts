import { UserSettings } from '@prisma/client'
export class UserService {
  userSettings: UserSettings
  constructor() {
    console.log('1')
  }
  getSettings() {
    console.log('2')
  }
}
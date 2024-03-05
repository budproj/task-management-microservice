
import { UserStatus } from './UserStatus.enum'
import { UserGender } from './UserGender.enum'

export interface User {
  id: any
  createdAt: Date
  firstName: string
  lastName?: string
  authzSub: string
  email: string
  status: UserStatus
  gender: UserGender
  updatedAt: Date
  role?: string
  picture?: string
  nickname?: string
  about?: string
  linkedInProfileAddress?: string
  fullName?: string
}


import { TeamGender } from './TeamGender.enum'
import { User } from '../users/User'

export interface Team {
  id: string
  name: string
  updatedAt: Date
  ownerId: User['id']
  owner: User
  description?: string | null
  gender?: TeamGender
  parentId?: Team['id']
}

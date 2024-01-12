import { Types } from 'mongoose'

export interface ITask {
  id: any
  boardId: Types.ObjectId
  status: TASK_STATUS
  title: string
  description: string
  dueDate: Date
  priority: number
  owner: string
  attachments: string[]
  supportTeamMembers: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export enum TASK_STATUS {
  pending = 'pending',
  toDo = 'toDo',
  doing = 'doing',
  done = 'done',
}

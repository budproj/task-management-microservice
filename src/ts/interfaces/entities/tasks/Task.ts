import { Types } from 'mongoose'

export interface ITask {
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
  nextTaskId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

enum TASK_STATUS {
  PENDING = 'PENDING',
  TO_DO = 'TO_DO',
  DOING = 'DOING',
  DONE = 'DONE',
}

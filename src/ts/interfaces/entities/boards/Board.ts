import { ITask } from '../tasks'

export interface IBoard {
  _id?: any
  title?: string
  type: BOARD_TYPE
  teamsIds?: string[]
  tasks: ITask[]
  order: {
    pending: string[]
    toDo: string[]
    doing: string[]
    done: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export enum BOARD_TYPE {
  TEAM_TASKS = 'TEAM_TASKS',
  PROJECT_TASKS = 'PROJECT_TASKS',
}

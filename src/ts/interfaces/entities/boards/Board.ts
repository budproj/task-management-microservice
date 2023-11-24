import { ITask } from '../tasks'

export interface IBoard {
  title: string
  type: BOARD_TYPE
  teamsIds?: string[]
  tasks: ITask[]
  createdAt: Date
  updatedAt: Date
}

enum BOARD_TYPE {
  TEAM_TASKS = 'TEAM_TASKS',
  PROJECT_TASKS = 'PROJECT_TASKS',
}

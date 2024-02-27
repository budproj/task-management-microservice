import { IService } from '../../abstract_classes'
import { ITask } from '../../entities'
import { ITaskUpdate } from '../../entities/task-updates/TaskUpdate'

export interface ITaskUpdatesService extends IService<ITaskUpdate> {
  getFromTaskId: (taskId: string) => Promise<ITaskUpdate[]>
  createTaskUpdateFromTask: (task: ITask) => Promise<ITaskUpdate>
  createTaskUpdates: (oldTask: ITask, newTask: Partial<ITask>, userIdThatUpdated: string) => Promise<ITaskUpdate>
}

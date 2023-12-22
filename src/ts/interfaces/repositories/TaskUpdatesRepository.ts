import { IRepository } from '../abstract_classes'
import { ITaskUpdate } from '../entities/task-updates/TaskUpdate'

export interface ITaskUpdatesRepository extends IRepository<ITaskUpdate> {
  getFromTaskId: (taskId: string) => Promise<ITaskUpdate[]>

}

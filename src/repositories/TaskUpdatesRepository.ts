import { PaginateResult } from 'mongoose'
import { AbstractRepository } from '../ts/abstract_classes'
import { ITaskUpdate } from '../ts/interfaces/entities/task-updates/TaskUpdate'
import { ITaskUpdatesRepository } from '../ts/interfaces/repositories/TaskUpdatesRepository'

export class TaskUpdatesRepository extends AbstractRepository<ITaskUpdate> implements ITaskUpdatesRepository {
  public async read (page: number, limit: number): Promise<PaginateResult<ITaskUpdate>> {
    return await this.model.paginate({}, { page, limit, sort: { boardId: 1, status: 1, priority: -1 } })
  }

  public async getFromTaskId (taskId: string): Promise<ITaskUpdate[]> {
    return await this.model.find({ taskId }).sort({ createdAt: -1 })
  }
}

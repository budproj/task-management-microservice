import { PaginateResult } from 'mongoose'
import { AbstractRepository } from '../ts/abstract_classes'
import { ITask, ITasksRepository } from '../ts/interfaces'

export class TasksRepository extends AbstractRepository<ITask> implements ITasksRepository {
  public async read (page: number, limit: number): Promise<PaginateResult<ITask>> {
    return await this.model.paginate({}, { page, limit, sort: { boardId: 1, status: 1, priority: -1 } })
  }

  public async readFromBoard (boardId: string): Promise<ITask[]> {
    return await this.model.find({ boardId }).sort({ status: 1, priority: -1 })
  }

  public async updateMembers (id: string, operation: '$addToSet' | '$pull', value: string): Promise<ITask | null> {
    return await this.model.findByIdAndUpdate(id, { [operation]: { members: value } }, { new: true })
  }

  public async updateTags (id: string, operation: '$addToSet' | '$pull', value: string): Promise<ITask | null> {
    return await this.model.findByIdAndUpdate(id, { [operation]: { tags: value } }, { new: true })
  }
}

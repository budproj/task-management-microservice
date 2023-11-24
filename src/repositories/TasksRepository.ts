import { PaginateResult } from 'mongoose'
import { AbstractRepository } from '../ts/abstract_classes'
import { ITask, ITasksRepository } from '../ts/interfaces'

// This is the class that will be used to interact with the "tasks" collection;
// It has the same methods as the abstract Repository class, but it uses the "taskModel" provided as argument to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class TasksRepository extends AbstractRepository<ITask> implements ITasksRepository {
  // Here I'm overriding the read method from the abstract class so that we can return paginated and sorted tasks.
  public async read (page: number, limit: number): Promise<PaginateResult<ITask>> {
    return await this.model.paginate({}, { page, limit, sort: { boardId: 1, status: 1, priority: -1 } })
  }

  // Here we create a new method exclusive to the TasksRepository class that will be used to read tasks from a specific board.
  public async readFromBoard (boardId: string): Promise<ITask[]> {
    return await this.model.find({ boardId }).sort({ status: 1, priority: -1 })
  }

  // Here we create a new method exclusive to the TasksRepository class that will be used to update the members array.
  public async updateMembers (id: string, operation: '$addToSet' | '$pull', value: string): Promise<ITask | null> {
    return await this.model.findByIdAndUpdate(id, { [operation]: { members: value } }, { new: true })
  }

  // This is basically a copy of the updateMembers implementation.
  public async updateTags (id: string, operation: '$addToSet' | '$pull', value: string): Promise<ITask | null> {
    return await this.model.findByIdAndUpdate(id, { [operation]: { tags: value } }, { new: true })
  }
}

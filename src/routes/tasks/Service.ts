import { AbstractService } from '../../ts/abstract_classes'
import { ITask, ITasksRepository, ITasksService } from '../../ts/interfaces'

export class TasksService extends AbstractService<ITask> implements ITasksService {
  constructor (protected readonly repository: ITasksRepository) {
    super(repository)
  }

  public async readFromBoard (boardId: string): Promise<ITask[]> {
    return await this.repository.readFromBoard(boardId)
  }

  public async updateMembers (id: string, operation: 1 | -1, value: string): Promise<ITask | null> {
    const op = operation === 1 ? '$addToSet' : '$pull'
    return await this.repository.updateMembers(id, op, value)
  }

  public async updateTags (id: string, operation: 1 | -1, value: string): Promise<ITask | null> {
    const op = operation === 1 ? '$addToSet' : '$pull'
    return await this.repository.updateTags(id, op, value)
  }

  public async archiveManyFromColumn (ids: string[]): Promise<void> {
    return await this.repository.archiveManyFromColumn(ids)
  }
}

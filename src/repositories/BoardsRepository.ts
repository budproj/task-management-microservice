import { PaginateResult } from 'mongoose'
import { AbstractRepository } from '../ts/abstract_classes'
import { IBoard, IBoardsRepository } from '../ts/interfaces'

// This is the class that will be used to interact with the "tasks" collection;
// It has the same methods as the abstract Repository class, but it uses the "taskModel" provided as argument to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class BoardsRepository extends AbstractRepository<IBoard> implements IBoardsRepository {
  // Here I'm overriding the read method from the abstract class so that we can return paginated and sorted tasks.
  public async read (page: number, limit: number): Promise<PaginateResult<IBoard>> {
    return await this.model.paginate({}, { page, limit, sort: { boardId: 1, status: 1, priority: -1 } })
  }

  public async getFromTeamId (teamId: string, body?: Partial<IBoard>): Promise<IBoard> {
    const board = await this.model.findOne({ teamsIds: { $in: [teamId] } }).exec()

    if (!board) {
      return await this.model.create(body)
    }

    return board
  }
}

import { AbstractService } from '../../ts/abstract_classes'
import { IBoard, IBoardsRepository, IBoardsService, ITask } from '../../ts/interfaces'

export class BoardsService extends AbstractService<IBoard> implements IBoardsService {
  constructor (protected readonly repository: IBoardsRepository) {
    super(repository)
  }

  public async findOrCreateFromTeams (teamsIds: string[], body?: Partial<IBoard>): Promise<IBoard> {
    return await this.repository.findOrCreateFromTeams(teamsIds, body)
  }

  public async updateBoardWithNewTask (boardId: string, newTask: ITask): Promise<IBoard | null> {
    return await this.repository.updateBoardWithNewTask(boardId, newTask)
  }
}

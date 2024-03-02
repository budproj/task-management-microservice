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

  public async updateBoardWithTaskStatus (boardId: string, newTask: ITask): Promise<IBoard | null> {
    return await this.repository.updateBoardWithTaskStatus(boardId, newTask)
  }

  public async deleteTaskInBoardOrder (boardId: string, id: ITask['id']): Promise<IBoard | null> {
    return await this.repository.deleteTaskInBoardOrder(boardId, id)
  }
}

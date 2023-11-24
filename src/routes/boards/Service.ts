import { AbstractService } from '../../ts/abstract_classes'
import { IBoard, IBoardsRepository, IBoardsService } from '../../ts/interfaces'

export class BoardsService extends AbstractService<IBoard> implements IBoardsService {
  constructor (protected readonly repository: IBoardsRepository) {
    super(repository)
  }

  public async getFromTeamId (teamId: string): Promise<IBoard> {
    return await this.repository.getFromTeamId(teamId)
  }
}

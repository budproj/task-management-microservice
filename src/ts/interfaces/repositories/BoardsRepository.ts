import { IRepository } from '../abstract_classes'
import { IBoard } from '../entities'

export interface IBoardsRepository extends IRepository<IBoard> {
  getFromTeamId: (id: string) => Promise<IBoard>
}

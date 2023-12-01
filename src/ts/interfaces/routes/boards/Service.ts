import { IService } from '../../abstract_classes'
import { IBoard } from '../../entities'

export interface IBoardsService extends IService<IBoard> {
  getFromTeamId: (id: string, body?: Partial<IBoard>) => Promise<IBoard>
}

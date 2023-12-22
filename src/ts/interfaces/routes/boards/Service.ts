import { IService } from '../../abstract_classes'
import { IBoard, ITask } from '../../entities'

export interface IBoardsService extends IService<IBoard> {
  getFromTeamId: (id: string, body?: Partial<IBoard>) => Promise<IBoard>
  updateBoardWithNewTask: (boardId: string, newTask: ITask) => Promise<IBoard | null>
}

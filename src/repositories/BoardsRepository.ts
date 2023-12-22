import { PaginateResult } from 'mongoose'
import { AbstractRepository } from '../ts/abstract_classes'
import { IBoard, IBoardsRepository, ITask, TASK_STATUS } from '../ts/interfaces'

export class BoardsRepository extends AbstractRepository<IBoard> implements IBoardsRepository {
  public async read (page: number, limit: number): Promise<PaginateResult<IBoard>> {
    return await this.model.paginate({}, { page, limit })
  }

  public async getFromTeamId (teamId: string, body?: Partial<IBoard>): Promise<IBoard> {
    const board = await this.model.findOne({ teamsIds: { $in: [teamId] } }).populate('tasks').exec()

    if (!board) {
      return await this.model.create({ ...body, teamsIds: [teamId] })
    }

    return board
  }

  public async updateBoardWithNewTask (boardId: string, newTask: ITask): Promise<IBoard | null> {
    const board = await this.model.findByIdAndUpdate(
      boardId,
      {
        $push: { tasks: newTask.id },
        $addToSet: {
          'order.pending': newTask.status === TASK_STATUS.pending ? newTask.id : undefined,
          'order.toDo': newTask.status === TASK_STATUS.toDo ? newTask.id : undefined,
          'order.doing': newTask.status === TASK_STATUS.doing ? newTask.id : undefined,
          'order.done': newTask.status === TASK_STATUS.done ? newTask.id : undefined
        }
      },

      { new: true }
    ).exec()

    return board
  }
}

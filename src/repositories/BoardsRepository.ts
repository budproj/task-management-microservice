import { PaginateResult } from 'mongoose'
import { AbstractRepository } from '../ts/abstract_classes'
import { IBoard, IBoardsRepository, ITask, TASK_STATUS } from '../ts/interfaces'

export class BoardsRepository extends AbstractRepository<IBoard> implements IBoardsRepository {
  public async read (page: number, limit: number): Promise<PaginateResult<IBoard>> {
    return await this.model.paginate({}, { page, limit })
  }

  // This method implements a lazy creation of a Board, if the Board doesn't exist it will be created
  public async findOrCreateFromTeams (teamsIds: string[], body?: Partial<IBoard>, archived = false): Promise<IBoard> {
    const queryCondition = archived ? { $ne: false } : false

    const board = await this.model.findOne({ teamsIds: { $in: teamsIds } }).populate({
      path: 'tasks',
      // this is not recommended but is because of mongodb behaviour ($ne)
      match: { active: queryCondition }
    }).exec()

    if (!board) {
      return await (await this.model.create({ ...body, teamsIds })).populate('tasks')
    }

    return board
  }

  public async updateBoardWithNewTask (boardId: string, newTask: ITask): Promise<IBoard | null> {
    const orderField = {
      [TASK_STATUS.pending]: 'order.pending',
      [TASK_STATUS.toDo]: 'order.toDo',
      [TASK_STATUS.doing]: 'order.doing',
      [TASK_STATUS.done]: 'order.done'
    }

    const orderStatus = orderField[newTask.status]

    const board = await this.model.findByIdAndUpdate(
      boardId,
      {
        $push: { tasks: newTask.id },
        $addToSet: {
          [orderStatus]: newTask.id
        }
      },

      { new: true }
    ).exec()

    return board
  }

  public async updateBoardWithTaskStatus (boardId: string, task: ITask): Promise<IBoard | null> {
    const orderField = {
      [TASK_STATUS.pending]: 'order.pending',
      [TASK_STATUS.toDo]: 'order.toDo',
      [TASK_STATUS.doing]: 'order.doing',
      [TASK_STATUS.done]: 'order.done'
    }

    const orderStatus = orderField[task.status]

    const board = await this.model.findByIdAndUpdate(
      boardId,
      {
        $addToSet: {
          [orderStatus]: task.id
        },
        $pull: {
          'order.pending': task.status !== TASK_STATUS.pending ? task.id : undefined,
          'order.toDo': task.status !== TASK_STATUS.toDo ? task.id : undefined,
          'order.doing': task.status !== TASK_STATUS.doing ? task.id : undefined,
          'order.done': task.status !== TASK_STATUS.done ? task.id : undefined
        }

      },

      { new: true }
    ).exec()

    return board
  }

  public async deleteTaskInBoardOrder (boardId: string, id: ITask['id']): Promise<IBoard | null> {
    const board = await this.model.findByIdAndUpdate(
      boardId,
      {
        $pull: {
          'order.pending': id,
          'order.toDo': id,
          'order.doing': id,
          'order.done': id
        }
      },

      { new: true }
    ).exec()

    return board
  }
}

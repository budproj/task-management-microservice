import { Request, Response } from 'express'
import { Controller } from '../../ts/abstract_classes'
import { ITaskUpdatesController, ITaskUpdatesService } from '../../ts/interfaces/routes/task-updates'
import { ITaskUpdate } from '../../ts/interfaces/entities/task-updates/TaskUpdate'

export class TaskUpdatesController extends Controller<ITaskUpdate> implements ITaskUpdatesController {
  constructor (protected readonly service: ITaskUpdatesService) {
    super(service)
    this.getFromTaskId = this.getFromTaskId.bind(this)
  }

  public async getFromTaskId (req: Request, res: Response): Promise<Response> {
    const taskId = req.params.taskId
    const result = await this.service.getFromTaskId(taskId)

    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }
}

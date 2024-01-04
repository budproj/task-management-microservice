import { Router } from 'express'
import { ITaskUpdatesController } from '../../ts/interfaces/routes/task-updates'
import { IMiddlewares } from '../../ts/interfaces'

export class TaskUpdatesRouter {
  public router = Router()

  constructor (
    private readonly controller: ITaskUpdatesController,
    private readonly middlewares: IMiddlewares
  ) {
    this.init()
  }

  public init (): void {
    this.router.use(this.middlewares.validateUser)

    this.router.post(
      '/',
      this.controller.create
    )

    this.router.get('/', this.controller.read)

    this.router.get('/task/:taskId', this.controller.getFromTaskId)

    this.router.patch(
      '/:id',
      this.controller.update
    )

    this.router.delete(
      '/:id',
      this.controller.delete
    )
  }
}

import { Router } from 'express'
import { IMiddlewares, IValidators, ITasksController } from '../../ts/interfaces'

export class TasksRouter {
  public router = Router()

  constructor (
    private readonly controller: ITasksController,
    private readonly middlewares: IMiddlewares,
    private readonly validators: IValidators
  ) {
    this.init()
  }

  public init (): void {
    this.router.use(this.middlewares.validateUser)
    this.router.post(
      '/',
      this.controller.createAndAddToBoard
    )

    this.router.get('/', this.controller.getTasks)

    this.router.get('/board/:boardId', this.controller.readFromBoard)

    this.router.patch(
      '/:id',
      this.middlewares.validatePathId,
      // this.middlewares.validateBody(this.validators.updateTaskValidator),
      this.controller.updateAndCreateTaskUpdate
    )

    this.router.patch(
      '/:id/archive',
      this.controller.archiveManyFromColumn
    )

    this.router.patch(
      '/:id/members',
      this.middlewares.validatePathId,
      this.middlewares.validateBody(this.validators.updateTaskMembersOrTagsValidator),
      this.controller.updateMembers
    )

    this.router.patch(
      '/:id/tags',
      this.middlewares.validatePathId,
      this.middlewares.validateBody(this.validators.updateTaskMembersOrTagsValidator),
      this.controller.updateTags
    )

    this.router.delete(
      '/:id',
      this.middlewares.validatePathId,
      this.controller.deleteWithCascade
    )

    this.router.delete(
      '/:id/delete',
      this.controller.deleteManyFromColumn
    )
  }
}

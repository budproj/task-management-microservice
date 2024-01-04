import { Router } from 'express'
import { IBoardsController, IMiddlewares } from '../../ts/interfaces'

export class BoardsRouter {
  public router = Router()

  constructor (
    private readonly controller: IBoardsController,
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

    this.router.get('/team/:teamId', this.controller.getFromTeamId)

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

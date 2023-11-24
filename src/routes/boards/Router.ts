import { Router } from 'express'
import { IBoardsController } from '../../ts/interfaces'

export class BoardsRouter {
  public router = Router()

  constructor (
    private readonly controller: IBoardsController
  ) {
    this.init()
  }

  public init (): void {
    this.router.post(
      '/boards',
      this.controller.create
    )

    this.router.get('/boards', this.controller.read)

    this.router.get('/boards/team/:teamId', this.controller.getFromTeamId)

    this.router.patch(
      '/boards/:id',
      this.controller.update
    )

    this.router.delete(
      '/:id',
      this.controller.delete
    )
  }
}

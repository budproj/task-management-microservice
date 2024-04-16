import { Response } from 'express'
import { Controller } from '../../ts/abstract_classes'
import { BOARD_TYPE, IBoard, IBoardsController, RequestBoard as Request } from '../../ts/interfaces'
import { IBoardsService } from '../../ts/interfaces/routes/boards/Service'
import { logger } from '../../logger'

export class BoardsController extends Controller<IBoard> implements IBoardsController {
  constructor (protected readonly service: IBoardsService) {
    super(service)
    this.getFromTeamId = this.getFromTeamId.bind(this)
    this.updateBoardOrder = this.updateBoardOrder.bind(this)
  }

  public async getFromTeamId (req: Request, res: Response): Promise<Response> {
    const body = req.body
    const teamId = req.query.teamId
    const archived = !!req.query.archived

    // When there are Boards related to entities other than Team we must make the type more flexible when creating a new Board
    const result = await this.service.findOrCreateFromTeams([teamId], { ...body, type: BOARD_TYPE.TEAM_TASKS }, !archived)

    if (!result) {
      logger.error('No Boards were found for the teamId provided, please make sure that the team exists')
      return res.status(404)
        .json({ message: 'No Boards were found for the boardId provided, please make sure that the board exists' })
    }

    return res.status(200).json(result)
  }

  public async updateBoardOrder (req: Request, res: Response): Promise<Response> {
    const board = await this.service.get(req.params.id)
    if (!board) return res.status(404).json({ message: 'Board not found' })

    const { column, order } = req.body

    const boardWithNewOrder: IBoard = { ...board, order: { [column]: order, ...board.order } }

    const result = await this.service.update(req.params.id, boardWithNewOrder)

    if (!result) return res.status(404).json({ message: 'Error updating board' })

    return res.status(200).json(result)
  }
}

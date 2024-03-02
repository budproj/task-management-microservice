import { Request as ExpressRequest, Response } from 'express'
import { IController } from '../../abstract_classes'

export type RequestBoard = ExpressRequest & {query: {
  teamId: string
}
}

export interface IBoardsController extends IController {
  getFromTeamId: (req: RequestBoard, res: Response) => Promise<Response>
  updateBoardOrder: (req: RequestBoard, res: Response) => Promise<Response>
}

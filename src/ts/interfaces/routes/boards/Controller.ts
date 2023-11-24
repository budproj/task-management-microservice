import { Request, Response } from 'express'
import { IController } from '../../abstract_classes'

export interface IBoardsController extends IController {
  getFromTeamId: (req: Request, res: Response) => Promise<Response>
}

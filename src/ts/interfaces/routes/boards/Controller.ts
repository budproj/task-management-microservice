import { Request as ExpressRequest, Response } from 'express'
import { IController } from '../../abstract_classes'

export type Request = ExpressRequest & {query: {
  teamId: string
}
}
export interface IBoardsController extends IController {
  getFromTeamId: (req: Request, res: Response) => Promise<Response>
}

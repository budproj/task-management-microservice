import { Request, Response } from 'express'
import { IController } from '../../abstract_classes'

export interface ITaskUpdatesController extends IController{
  getFromTaskId: (req: Request, res: Response) => Promise<Response>
}

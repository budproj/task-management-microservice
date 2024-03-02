import { Request as ExpressRequestTask, Response } from 'express'
import { IController } from '../../abstract_classes'

export type RequestTask = ExpressRequestTask & {query: {
  id: string
}
}

export interface ITasksController extends IController {
  readFromBoard: (req: RequestTask, res: Response) => Promise<Response>
  updateMembers: (req: RequestTask, res: Response) => Promise<Response>
  updateTags: (req: RequestTask, res: Response) => Promise<Response>
  createAndAddToBoard: (req: RequestTask, res: Response) => Promise<Response>
  updateAndCreateTaskUpdate: (req: RequestTask, res: Response) => Promise<Response>
  deleteWithCascade: (req: RequestTask, res: Response) => Promise<void>
  getTasks: (req: RequestTask, res: Response) => Promise<Response>
}

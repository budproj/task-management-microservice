import { Request, Response } from 'express'
import { Controller } from '../../ts/abstract_classes'
import { IBoard, IBoardsController } from '../../ts/interfaces'
import { IBoardsService } from '../../ts/interfaces/routes/boards/Service'

// This is the class that will be used to handle everything relate to http requests for the Boards;
// It has the same methods as the abstract Controller class, but it uses a "BoardsService" instance
// provided as argument to the constructor;
// If needed, we can add additional methods or override the ones from the abstract class (polymorphism).
export class BoardsController extends Controller<IBoard> implements IBoardsController {
  // We need to specify a constructor for the BoardsController class that will receive a service that follows IBoardsService interface.
  // This is because we need to use the methods that do not exist in the abstract (generic) service.
  // If we don't specify a constructor, the "updateMembers" method will be undefined.
  constructor (protected readonly service: IBoardsService) {
    super(service)
    this.getFromTeamId = this.getFromTeamId.bind(this) // We also need to bind the method here so that we dont lose the context of the "this" keyword.
  }

  // Here we create a new method exclusive to the BoardsController class that will be used to read Boards from a specific board.
  public async getFromTeamId (req: Request, res: Response): Promise<Response> {
    const result = await this.service.getFromTeamId(req.params.id)
    if (!result) {
      return res.status(404)
        .json({ message: 'No Boards were found for the boardId provided, please make sure that the board exists' })
    }

    return res.status(200).json(result)
  }
}

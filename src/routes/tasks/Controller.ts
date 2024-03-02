import { Response } from 'express'
import { Controller } from '../../ts/abstract_classes'
import { IBoardsService, ITask, ITaskUpdatesService, ITasksController, RequestTask as Request } from '../../ts/interfaces'
import { ITasksService } from '../../ts/interfaces/routes/tasks/Service'
export class TasksController extends Controller<ITask> implements ITasksController {
  constructor (
    protected readonly service: ITasksService,
    protected readonly boardsService: IBoardsService,
    protected readonly taskUpdatesService: ITaskUpdatesService
  ) {
    super(service)
    this.boardsService = boardsService
    this.readFromBoard = this.readFromBoard.bind(this)
    this.updateMembers = this.updateMembers.bind(this)
    this.updateTags = this.updateTags.bind(this)
    this.createAndAddToBoard = this.createAndAddToBoard.bind(this)
    this.updateAndCreateTaskUpdate = this.updateAndCreateTaskUpdate.bind(this)
    this.deleteWithCascade = this.deleteWithCascade.bind(this)
    this.getTasks = this.getTasks.bind(this)
  }

  public async readFromBoard (req: Request, res: Response): Promise<Response> {
    const result = await this.service.readFromBoard(req.params.boardId)
    if (!result.length) {
      return res.status(404)
        .json({ message: 'No tasks were found for the boardId provided, please make sure that the board exist and have tasks' })
    }
    return res.status(200).json(result)
  }

  public async updateMembers (req: Request, res: Response): Promise<Response> {
    const { operation, value } = req.body
    const result = await this.service.updateMembers(req.params.id, operation, value)
    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }

  public async updateTags (req: Request, res: Response): Promise<Response> {
    const { operation, value } = req.body
    const result = await this.service.updateTags(req.params.id, operation, value)
    if (!result) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(result)
  }

  public async createAndAddToBoard (req: Request, res: Response): Promise<Response> {
    const board = await this.boardsService.get(req.body.boardId)

    if (!board) return res.status(404).json({ message: 'Board not found' })

    const result = await this.service.create(req.body)

    if (!result) return res.status(404).json({ message: 'Error creating task' })

    await this.boardsService.updateBoardWithNewTask(board._id, result)
    const taskUpdate = await this.taskUpdatesService.createTaskUpdateFromTask(result)

    if (!taskUpdate) return res.status(404).json({ message: 'Error creating created task update' })

    return res.status(200).json(result)
  }

  public async updateAndCreateTaskUpdate (req: Request, res: Response): Promise<Response> {
    const task = await this.service.get(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })

    const result = await this.service.update(req.params.id, req.body)
    if (!result) return res.status(404).json({ message: 'Error updating task' })

    const taskUpdate = await this.taskUpdatesService.createTaskUpdates(task, req.body, req.user)

    if (!taskUpdate) return res.status(404).json({ message: 'Error creating created task update' })

    await this.boardsService.updateBoardWithTaskStatus(task.boardId.toString(), result)

    return res.status(200).json(result)
  }

  public async deleteWithCascade (req: Request, res: Response): Promise<void> {
    const task = await this.service.get(req.params.id)
    await this.delete(req, res)

    if (task) {
      await this.boardsService.deleteTaskInBoardOrder(task?.boardId.toString(), req.params.id)
    }
  }

  public async getTasks (req: Request, res: Response): Promise<Response> {
    const task = await this.service.get(req.query.id)

    if (!task) return res.status(404).json({ message: 'Task not found' })

    return res.status(200).json(task)
  }
}

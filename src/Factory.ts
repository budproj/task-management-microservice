import { Router } from 'express'
import { boardModel, taskModel, taskUpdateModel } from './database'
import { TasksRepository } from './repositories/TasksRepository'
import { TasksService, TasksController, TasksRouter } from './routes/tasks'
import * as middlewares from './middlewares'
import * as validators from './validators'
import { BoardsRepository } from './repositories/BoardsRepository'
import { BoardsController, BoardsRouter, BoardsService } from './routes/boards'
import { TaskUpdatesController, TaskUpdatesRouter, TaskUpdatesService } from './routes/task-updates'
import { TaskUpdatesRepository } from './repositories/TaskUpdatesRepository'

const tasksRepository = new TasksRepository(taskModel)
const boardsRepository = new BoardsRepository(boardModel)
const taskUpdatesRepository = new TaskUpdatesRepository(taskUpdateModel)

class RoutersFactory {
  public createTasksRouter (): Router {
    const taskUpdatesService = new TaskUpdatesService(taskUpdatesRepository)
    const boardsService = new BoardsService(boardsRepository)
    const tasksService = new TasksService(tasksRepository)
    const tasksController = new TasksController(tasksService, boardsService, taskUpdatesService)
    const tasksRouter = new TasksRouter(tasksController, middlewares, validators)
    return tasksRouter.router
  }

  public createBoardsRouter (): Router {
    const boardsService = new BoardsService(boardsRepository)
    const boardsController = new BoardsController(boardsService)
    const boardsRouter = new BoardsRouter(boardsController, middlewares)
    return boardsRouter.router
  }

  public createTaskUpdatesRouter (): Router {
    const taskUpdatesService = new TaskUpdatesService(taskUpdatesRepository)
    const taskUpdatesController = new TaskUpdatesController(taskUpdatesService)
    const taskUpdatesRouter = new TaskUpdatesRouter(taskUpdatesController, middlewares)
    return taskUpdatesRouter.router
  }
}

export const routersFactory = new RoutersFactory()

/*
  Here is where the magic happens and all the layers of our application are connected.
  We create instances of every layer of your application, injecting them with whatever they need to work.
  You can see that it's kind of domino effect where we start with the repository (lower-most layer) injecting
  it with the mongoose model, that we get the instance of this repository and instanciate the service that
  needs the repository. We do that until we instanciate the router class and the return the express router
  that is inside the router instance.

  You might be curious about why we are not instanciating the repository inside the class method.
  The reason is quite simples actually, contrary to the other layers of our application that are directly
  linked to the endpoints (/tasks, /users, etc). Repositories are not related exclusively to the endpoints
  they share name with, but with the database tables/collections and can be used in multiple groups of endpoints.
  Imagine endpoints for admins, we would have a service, controller and router specifically for admins, but
  these operations could use multiple repositories because they need access to multiple tables/collections.
*/

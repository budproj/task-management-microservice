import { AbstractService } from '../../ts/abstract_classes'
import { ITask } from '../../ts/interfaces'
import { IAuthorType, ITaskPatchInterface, ITaskUpdate, TaskPatchsKeys } from '../../ts/interfaces/entities/task-updates/TaskUpdate'
import { ITaskUpdatesRepository } from '../../ts/interfaces/repositories/TaskUpdatesRepository'
import { ITaskUpdatesService } from '../../ts/interfaces/routes/task-updates'
import { randomUUID } from 'crypto'
import { User } from '../../ts/interfaces/entities/users/User'
import { boardModel } from '../../database/models'
import AmqpConnection from '../messaging/amqp-connection'

export class TaskUpdatesService extends AbstractService<ITaskUpdate> implements ITaskUpdatesService {
  constructor (protected readonly repository: ITaskUpdatesRepository) {
    super(repository)
  }

  public async getFromTaskId (id: string): Promise<ITaskUpdate[]> {
    return await this.repository.getFromTaskId(id)
  }

  private async sendOneNotification (user: string, senderUserData: User, task: any): Promise<any> {
    const amqp = new AmqpConnection()
    const userData = await amqp.sendMessage<User>(
      'business.core-ports.get-user',
      {
        id: user
      }
    )
    const board = await boardModel.findById(task.boardId)

    const notification = {
      messageId: randomUUID(),
      type: 'taskAssignInProject',
      timestamp: new Date().toISOString(),
      recipientId: userData.authzSub,
      properties: {
        sender: {
          id: senderUserData.authzSub,
          name: senderUserData.firstName,
          picture: senderUserData.picture
        },
        task: {
          id: task.taskId,
          name: task.title
        },
        taskBoard: task,
        teamId: board?.teamsIds?.[0]
      }
    }
    return await amqp.sendMessage('notifications-microservice.notification', notification) as any
  }

  private async sendAllNotifications (users: string[], senderUserData: User, task: any): Promise<any[]> {
    const promises: Array<Promise<any>> = users.map(async user => {
      return await this.sendOneNotification(user, senderUserData, task)
    })
    await Promise.all(promises)
    return promises
  }

  public async createTaskUpdateFromTask (task: ITask, userThatUpdated: any): Promise<ITaskUpdate> {
    const author = { type: IAuthorType.USER, identifier: task.owner }
    const state = {
      _id: task.id,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      initialDate: task.dueDate,
      owner: task.owner,
      description: task.description,
      supportTeam: task.supportTeamMembers,
      author,
      status: task.status,
      boardId: task.boardId
    }

    const usersToNotificate = [...state.supportTeam, state.owner]

    await this.sendAllNotifications(usersToNotificate, userThatUpdated, state)

    return await this.repository.create({
      taskId: task.id,
      author,
      newState: state,
      oldState: state,
      patches: [{ key: TaskPatchsKeys.createdTask, value: TaskPatchsKeys.createdTask }]
    })
  }

  public async createTaskUpdates (oldTask: ITask, newTask: Partial<ITask>, userThatUpdated: any): Promise<ITaskUpdate | undefined> {
    const author = { type: IAuthorType.USER, identifier: userThatUpdated.id }

    const oldTaskstate = {
      _id: oldTask.id,
      title: oldTask.title,
      priority: oldTask.priority,
      dueDate: oldTask.dueDate,
      initialDate: oldTask.initialDate,
      owner: oldTask.owner,
      description: oldTask.description,
      supportTeam: oldTask.supportTeamMembers,
      status: oldTask.status,
      boardId: oldTask.boardId
    }

    const newTaskState = {
      _id: oldTask.id,
      title: newTask.title ?? oldTask.title,
      priority: newTask.priority ?? oldTask.priority,
      dueDate: newTask.dueDate ?? oldTask.dueDate,
      initialDate: newTask.initialDate ?? oldTask.initialDate,
      owner: newTask.owner ?? oldTask.owner,
      description: newTask.description ?? oldTask.description,
      supportTeam: newTask.supportTeamMembers ?? oldTask.supportTeamMembers,
      status: newTask.status ?? oldTask.status,
      boardId: newTask.boardId ?? oldTask.boardId
    }

    const updatePatches: ITaskPatchInterface[] = Object.keys(newTask).filter(key => key !== '_id').map((key) => ({
      // tipos precisam ser revistos
      key: TaskPatchsKeys[key as keyof typeof TaskPatchsKeys],
      value: (newTask as any)[key]
    }))

    const oldUsersToNotificate = [...oldTaskstate.supportTeam, oldTaskstate.owner]
    const newUsersToNotificate = [...newTaskState.supportTeam, newTaskState.owner]
    const usersToNotificate = newUsersToNotificate.filter(user => !oldUsersToNotificate.includes(user))

    await this.sendAllNotifications(usersToNotificate, userThatUpdated, newTaskState)

    if (updatePatches.length > 0) {
      return await this.repository.create({
        taskId: oldTask.id,
        author,
        newState: newTaskState,
        oldState: oldTaskstate,
        patches: updatePatches
      })
    }
  }
}

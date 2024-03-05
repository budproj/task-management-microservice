import { AbstractService } from '../../ts/abstract_classes'
import { ITask } from '../../ts/interfaces'
import { IAuthorType, ITaskPatchInterface, ITaskUpdate, TaskPatchsKeys } from '../../ts/interfaces/entities/task-updates/TaskUpdate'
import { ITaskUpdatesRepository } from '../../ts/interfaces/repositories/TaskUpdatesRepository'
import { ITaskUpdatesService } from '../../ts/interfaces/routes/task-updates'
import { randomUUID } from 'crypto'
import { User } from '../../ts/interfaces/entities/users/User'
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
          id: task.id,
          name: task.title
        }
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

  public async createTaskUpdateFromTask (task: ITask): Promise<ITaskUpdate> {
    const author = { type: IAuthorType.USER, identifier: task.owner }

    const state = {
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      initialDate: task.dueDate,
      owner: task.owner,
      description: task.description,
      supportTeam: task.supportTeamMembers,
      author,
      status: task.status
    }

    // Quando tivermos o id de quem realizou a ação, é importante que ele não gere notificação para si mesmo
    const amqp = new AmqpConnection()
    const usersToNotificate = [...state.supportTeam, state.owner]

    const ownerData = await amqp.sendMessage<any>(
      'business.core-ports.get-user',
      {
        id: state.owner
      }
    )

    await this.sendAllNotifications(usersToNotificate, ownerData, state)

    const notification = {
      messageId: randomUUID(),
      type: 'taskAssignInProject',
      timestamp: new Date().toISOString(),
      recipientId: ownerData.authzSub, // get authzSub from value
      properties: {
        sender: {
          id: ownerData.authzSub,
          name: ownerData.firstName,
          picture: ownerData.picture
        },
        task: {
          id: task.id,
          name: state.title
        }
      }
    }
    await amqp.sendMessage('notifications-microservice.notification', notification) as any

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
      title: oldTask.title,
      priority: oldTask.priority,
      dueDate: oldTask.dueDate,
      initialDate: oldTask.initialDate,
      owner: oldTask.owner,
      description: oldTask.description,
      supportTeam: oldTask.supportTeamMembers,
      status: oldTask.status
    }

    const newTaskState = {
      title: newTask.title ?? oldTask.title,
      priority: newTask.priority ?? oldTask.priority,
      dueDate: newTask.dueDate ?? oldTask.dueDate,
      initialDate: newTask.initialDate ?? oldTask.initialDate,
      owner: newTask.owner ?? oldTask.owner,
      description: newTask.description ?? oldTask.description,
      supportTeam: newTask.supportTeamMembers ?? oldTask.supportTeamMembers,
      status: newTask.status ?? oldTask.status
    }

    const updatePatches: ITaskPatchInterface[] = Object.keys(newTask).filter(key => key !== '_id').map((key) => ({
      // tipos precisam ser revistos
      key: TaskPatchsKeys[key as keyof typeof TaskPatchsKeys],
      value: (newTask as any)[key]
    }))

    if (updatePatches.length > 0) {
      await this.repository.create({
        taskId: oldTask.id,
        author,
        newState: newTaskState,
        oldState: oldTaskstate,
        patches: updatePatches
      })
    }

    const oldUsersToNotificate = [...oldTaskstate.supportTeam, oldTaskstate.owner]
    const newUsersToNotificate = [...newTaskState.supportTeam, newTaskState.owner]
    const usersToNotificate = newUsersToNotificate.filter(user => !oldUsersToNotificate.includes(user))
    const amqp = new AmqpConnection()

    const senderUserData = await amqp.sendMessage<any>(
      'business.core-ports.get-user',
      {
        id: oldTaskstate.owner
      }
    )

    await this.sendAllNotifications(usersToNotificate, senderUserData, newTaskState)

    return await this.repository.create({
      taskId: oldTask.id,
      author,
      newState: newTaskState,
      oldState: oldTaskstate,
      patches: updatePatches
    })
  }
}

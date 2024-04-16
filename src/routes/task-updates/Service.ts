import { AbstractService } from '../../ts/abstract_classes'
import { ITask } from '../../ts/interfaces'
import { IAuthorType, ITaskPatchInterface, ITaskUpdate, TaskPatchsKeys } from '../../ts/interfaces/entities/task-updates/TaskUpdate'
import { ITaskUpdatesRepository } from '../../ts/interfaces/repositories/TaskUpdatesRepository'
import { ITaskUpdatesService } from '../../ts/interfaces/routes/task-updates'

export class TaskUpdatesService extends AbstractService<ITaskUpdate> implements ITaskUpdatesService {
  constructor (protected readonly repository: ITaskUpdatesRepository) {
    super(repository)
  }

  public async getFromTaskId (id: string): Promise<ITaskUpdate[]> {
    return await this.repository.getFromTaskId(id)
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

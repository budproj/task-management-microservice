import { TasksService } from "../../../../../src/routes/tasks/Service"
import { MockTasksRepository } from "../../../../__mocks__"

const mockTasksRepository = new MockTasksRepository()
const taskService = new TasksService(mockTasksRepository)

const fakeUpdatedTask = {
  _id: '1',
  boardId: 1,
  status: 'in_progress',
  title: 'test',
  description: 'test',
  priority: 1,
  members: [],
  tags: []
}

describe("TasksService updateMembers method unit tests", () => {
  beforeAll(() => { // mock the return value of the tasksRepository.updateMembers method
    mockTasksRepository.updateMembers = jest.fn().mockResolvedValue(fakeUpdatedTask)
  })

  describe('When operation is 1', () => {
    it("should call the updateMembers method of the repository with id, $addToSet and value", async () => {
      await taskService.updateMembers('1', 1, 'test')
  
      expect(mockTasksRepository.updateMembers).toHaveBeenCalledWith('1', '$addToSet', 'test')
    })

    it("should return the result of the repository's updateMembers method", async () => {
      const result = await taskService.updateMembers('1', 1, 'test')
  
      expect(result).toEqual(fakeUpdatedTask)
    })
  })

  describe('When operation is -1', () => {
    it("should call the updateMembers method of the repository with id, $pull and value", async () => {
      await taskService.updateMembers('1', -1, 'test')
  
      expect(mockTasksRepository.updateMembers).toHaveBeenCalledWith('1', '$pull', 'test')
    })

    it("should return the result of the repository's updateMembers method", async () => {
      const result = await taskService.updateMembers('1', -1, 'test')
  
      expect(result).toEqual(fakeUpdatedTask)
    })
  })
})
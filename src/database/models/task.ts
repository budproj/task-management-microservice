import { Document, Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { ITask } from '../../ts/interfaces'

interface TaskDocument extends ITask, Document {}

const taskSchema = new Schema<TaskDocument>({
  boardId: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, required: true }, // PENDING, TO_DO, DOING, DONE
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: Number, required: true }, // min: 1 max: 4
  owner: { type: String, required: true },
  attachments: [String],
  supportTeamMembers: [String],
  tags: [String],
  nextTaskId: { type: Schema.Types.ObjectId, ref: 'Task' },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, {
  collection: 'tasks',
  versionKey: false
})

taskSchema.plugin(paginate)

export const taskModel = model<TaskDocument, PaginateModel<TaskDocument>>('Task', taskSchema, 'tasks')

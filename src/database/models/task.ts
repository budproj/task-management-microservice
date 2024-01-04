import { Document, Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { ITask } from '../../ts/interfaces'

type TaskDocument = ITask & Document

const taskSchema = new Schema<TaskDocument>({
  boardId: { type: Schema.Types.ObjectId, required: true, ref: 'Board' },
  status: { type: String, required: true }, // PENDING, TO_DO, DOING, DONE
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date },
  priority: { type: Number, required: true }, // min: 1 max: 4
  owner: { type: String, required: true },
  attachments: [String],
  supportTeamMembers: [String],
  tags: [String],
  nextTaskId: { type: Schema.Types.ObjectId, ref: 'Task' }
}, {
  collection: 'tasks',
  versionKey: false,
  timestamps: true
})

taskSchema.plugin(paginate)

export const taskModel = model<TaskDocument, PaginateModel<TaskDocument>>('Task', taskSchema, 'tasks')

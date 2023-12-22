import { Document, Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { ITaskUpdate } from '../../ts/interfaces/entities/task-updates/TaskUpdate'

interface TaskDocument extends ITaskUpdate, Document {}

const taskUpdateSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  oldState: { type: Object, required: true },
  patches: { type: [Object], required: true },
  newState: { type: Object, required: true },
  author: { type: Object, required: true }
}, {
  collection: 'task-updates',
  versionKey: false,
  timestamps: true
})

taskUpdateSchema.plugin(paginate)

export const taskUpdateModel = model<TaskDocument, PaginateModel<TaskDocument>>('TaskUpdate', taskUpdateSchema, 'task-updates')

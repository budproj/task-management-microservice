import { Document, Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { IBoard } from '../../ts/interfaces'

interface BoardDocument extends IBoard, Document {}

const boardSchema = new Schema<BoardDocument>({
  title: { type: String, required: true },
  teamsIds: [String],
  type: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  order: {
    pending: [String],
    toDo: [String],
    doing: [String],
    done: [String]
  }
}, {
  collection: 'boards',
  versionKey: false,
  timestamps: true
})

boardSchema.plugin(paginate)

export const boardModel = model<BoardDocument, PaginateModel<BoardDocument>>('Board', boardSchema, 'boards')

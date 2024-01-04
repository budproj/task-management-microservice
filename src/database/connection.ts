import mongoose from 'mongoose'
import { taskModel } from './models'

export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGO_URI ??
      'mongodb://root:changeme@localhost:27017/task-management-microservice?authSource=admin'

    await mongoose.connect(mongoURI)
    console.log('Database connection established')
    // If the tasks collection is empty it will be seeded with mock data during the first connection.
    if ((await taskModel.countDocuments()) === 0) {
      // await taskModel.insertMany(tasksSeed)
      console.log('Database seeded with 28 random tasks')
    }
  } catch (e) {
    console.log(e)
    console.error('Database connection failed')
    process.exit(1)
  }
}

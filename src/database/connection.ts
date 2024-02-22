import mongoose from 'mongoose'
import { taskModel } from './models'
import { logger } from '../logger'

export const connectToDatabase = async (): Promise<void> => {
  try {
    logger.info('Connecting to database')
    const mongoURI =
      process.env.MONGO_URI ??
      'mongodb://root:changeme@mongo:27017/task-management-microservice?authSource=admin'

    await mongoose.connect(mongoURI)
    // console.log('Database connection established')
    logger.info('Database connection established')
    // If the tasks collection is empty it will be seeded with mock data during the first connection.
    if ((await taskModel.countDocuments()) === 0) {
      // await taskModel.insertMany(tasksSeed)
      console.log('Database seeded with 28 random tasks')
    }
  } catch (e) {
    console.log(e)
    // console.error('Database connection failed')
    logger.error('Database connection failed')
    process.exit(1)
  }
}

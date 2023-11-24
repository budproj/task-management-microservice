import { connectToDatabase } from './database'
import { app } from './app'
import amqp from 'amqplib'

const PORT = process.env.PORT ?? 3001

const start = async (): Promise<void> => {
  await connectToDatabase()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

const connectQueue = async (): Promise<void> => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672')
    const channel = await connection.createChannel()

    await channel.assertQueue('test-queue')
  } catch (error) {
    console.log(error)
  }
}

void connectQueue()
void start()

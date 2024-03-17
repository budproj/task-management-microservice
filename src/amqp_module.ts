import * as amqp from 'amqplib/callback_api'
import { taskModel, boardModel } from './database/models'
import AmqpConnection from './routes/messaging/amqp-connection'

export default async function setupAMQP (): Promise<void> {
  const rabbitmqUrl = process.env.RABBITMQ_CONNECTION_STRING ?? 'amqp://localhost'
  const queueName = 'task-management-microservice.comment-in-task'
  const routingKey = 'task-management-microservice.comment-in-task'
  const connection = await new Promise<amqp.Connection>((resolve, reject) => {
    amqp.connect(rabbitmqUrl, (err, conn) => {
      if (err) reject(err)
      else resolve(conn)
    })
  })
  const channel = await new Promise<amqp.Channel>((resolve, reject) => {
    connection.createChannel((err, ch) => {
      if (err) reject(err)
      else resolve(ch)
    })
  })
  // channel.assertExchange('bud', 'topic')
  // channel.assertQueue(queueName)
  // channel.bindQueue(queueName, 'bud', routingKey)
  await channel.consume(queueName, async (msg: any) => {
    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString())
        const task = await taskModel.findById(data.id)
        const board = await boardModel.findById(task?.boardId)

        if (task) {
          const amqpSender = new AmqpConnection()
          await amqpSender.sendMessage(
            'business.notification-ports.comment-in-task-notification',
            {
              userThatCommented: data.user,
              taskThatReceivedComment: task,
              comment: data.comment,
              teamId: board?.teamsIds
            }
          )
          channel.ack(msg)
          return task
        }
      } catch (error) {
        console.error('Error finding task in database:', error)
      }
    }
  }, { consumerTag: 'teste' })
}

// https://dev.to/omardiaa48/microservices-with-expressjs-and-rabbitmq-34dk

import * as amqp from 'amqplib/callback_api'
import { taskModel } from './database/models'
import AmqpConnection from './routes/messaging/amqp-connection'

export default async function setupAMQP (): Promise<void> {
  const rabbitmqUrl = 'amqp://localhost'
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
  channel.assertExchange('bud', 'topic')
  channel.assertQueue(queueName)
  channel.bindQueue(queueName, 'bud', routingKey)
  channel.consume(queueName, async (msg: any) => {
    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString())
        const task = await taskModel.findById(data.id)

        if (task) {
          const amqpSender = new AmqpConnection()
          await amqpSender.sendMessage(
            'business.notification-ports.comment-in-task-notification',
            {
              userThatCommented: data.user,
              taskThatReceivedComment: task,
              comment: data.comment
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

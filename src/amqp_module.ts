import * as amqp from 'amqplib/callback_api'
import { taskModel, boardModel } from './database/models'
import AmqpConnection from './routes/messaging/amqp-connection'
import { randomUUID } from 'crypto'

export default async function setupAMQP (): Promise<void> {
  const rabbitmqUrl = process.env.RABBITMQ_CONNECTION_STRING ?? 'amqp://localhost'
  const queueName = 'task-management-microservice.comment-in-task'
  // const routingKey = 'task-management-microservice.comment-in-task'
  const connection = await new Promise<amqp.Connection>((resolve, reject) => {
    amqp.connect(rabbitmqUrl, (err, conn) => {
      if (err) {
        const amqpSender = new AmqpConnection()
        void amqpSender.sendMessage(
          'business.notification-ports.comment-in-task-notification',
          {
            userThatCommented: { id: 'auth0|auth0|6243762bdf154e0068d272d7', name: 'Igor Omote', picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg' },
            taskThatReceivedComment: { id: '65e08a748b491e52ee118057', name: 'connect' },
            comment: { id: '84b754d4-ebab-4d29-8f7b-79de03dcba0b', content: err },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
          }
        )
        reject(err)
      } else resolve(conn)
    })
  })
  const channel = await new Promise<amqp.Channel>((resolve, reject) => {
    connection.createChannel((err, ch) => {
      if (err) {
        const amqpSender = new AmqpConnection()
        void amqpSender.sendMessage(
          'business.notification-ports.comment-in-task-notification',
          {
            userThatCommented: { id: 'auth0|auth0|6243762bdf154e0068d272d7', name: 'Igor Omote', picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg' },
            taskThatReceivedComment: { id: '65e08a748b491e52ee118057', name: 'channel' },
            comment: { id: '84b754d4-ebab-4d29-8f7b-79de03dcba0b', content: err },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
          }
        )
        reject(err)
      } else resolve(ch)
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
          const notification = {
            messageId: randomUUID(),
            type: 'provingSomething',
            timestamp: new Date().toISOString(),
            recipientId: 'auth0|auth0|6243762bdf154e0068d272d7',
            properties: {
              sender: {
                id: 'auth0|auth0|6243762bdf154e0068d272d7',
                name: 'Igor Omote',
                picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
              },
              task: {
                id: '65e08a748b491e52ee118057',
                name: 'sending something'
              },
              taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
              teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
            }
          }
          await amqpSender.sendMessage('notifications-microservice.notification', notification) as any
          await amqpSender.sendMessage(
            'business.notification-ports.comment-in-task-notification',
            {
              userThatCommented: data.user,
              taskThatReceivedComment: task,
              comment: data.comment,
              teamId: board?.teamsIds?.[0]
            }
          )
          channel.ack(msg)
          return task
        }
      } catch (error) {
        console.error('Error finding task in database:', error)
        const amqpSender = new AmqpConnection()
        await amqpSender.sendMessage(
          'business.notification-ports.comment-in-task-notification',
          {
            userThatCommented: { id: 'auth0|auth0|6243762bdf154e0068d272d7', name: 'Igor Omote', picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg' },
            taskThatReceivedComment: { id: '65e08a748b491e52ee118057', name: 'consume' },
            comment: { id: '84b754d4-ebab-4d29-8f7b-79de03dcba0b', content: error },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
          }
        )
      }
    }
  }, { consumerTag: 'teste' })
}

// https://dev.to/omardiaa48/microservices-with-expressjs-and-rabbitmq-34dk

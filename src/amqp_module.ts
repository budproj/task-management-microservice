import * as amqp from 'amqplib/callback_api'
import { taskModel, boardModel } from './database/models'
import AmqpConnection from './routes/messaging/amqp-connection'
import { randomUUID } from 'crypto'

export default async function setupAMQP (): Promise<void> {
  const rabbitmqUrl = process.env.RABBITMQ_CONNECTION_STRING ?? 'amqp://localhost'
  const queueName = 'task-management-microservice.comment-in-task'
  const routingKey = 'task-management-microservice.comment-in-task'
  const connection = await new Promise<amqp.Connection>((resolve, reject) => {
    amqp.connect(rabbitmqUrl, (err, conn) => {
      if (err) {
        reject(err)
      } else {
        // const amqpSender = new AmqpConnection()
        // const notification = {
        //   messageId: randomUUID(),
        //   type: 'provingSomething',
        //   timestamp: new Date().toISOString(),
        //   recipientId: 'auth0|6243762bdf154e0068d272d7',
        //   properties: {
        //     sender: {
        //       id: 'auth0|6243762bdf154e0068d272d7',
        //       name: 'Igor Omote',
        //       picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
        //     },
        //     task: {
        //       id: '65e08a748b491e52ee118057',
        //       name: rabbitmqUrl
        //     },
        //     taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
        //     teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
        //   }
        // }
        // amqpSender.sendMessage('notifications-microservice.notification', notification) as any
        resolve(conn)
      }
    })
  })
  const channel = await new Promise<amqp.Channel>((resolve, reject) => {
    connection.createChannel((err, ch) => {
      if (err) {
        reject(err)
      } else {
        // const amqpSender = new AmqpConnection()
        // const notification = {
        //   messageId: randomUUID(),
        //   type: 'provingSomething',
        //   timestamp: new Date().toISOString(),
        //   recipientId: 'auth0|6243762bdf154e0068d272d7',
        //   properties: {
        //     sender: {
        //       id: 'auth0|6243762bdf154e0068d272d7',
        //       name: 'Igor Omote',
        //       picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
        //     },
        //     task: {
        //       id: '65e08a748b491e52ee118057',
        //       name: 'channelOK'
        //     },
        //     taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
        //     teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
        //   }
        // }
        // amqpSender.sendMessage('notifications-microservice.notification', notification) as any
        resolve(ch)
      }
    })
  })
  channel.assertExchange('bud', 'topic')
  channel.assertQueue(queueName)
  channel.bindQueue(queueName, 'bud', routingKey)
  channel.consume(queueName, async (msg: any) => {
    const amqpSender = new AmqpConnection()
    const notification = {
      messageId: randomUUID(),
      type: 'provingSomething',
      timestamp: new Date().toISOString(),
      recipientId: 'auth0|6243762bdf154e0068d272d7',
      properties: {
        sender: {
          id: 'auth0|6243762bdf154e0068d272d7',
          name: 'Igor Omote',
          picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
        },
        task: {
          id: '65e08a748b491e52ee118057',
          name: 'recebi algo'
        },
        taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
        teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
      }
    }
    amqpSender.sendMessage('notifications-microservice.notification', notification) as any
    if (msg !== null) {
      const amqpSender = new AmqpConnection()
      const notification = {
        messageId: randomUUID(),
        type: 'provingSomething',
        timestamp: new Date().toISOString(),
        recipientId: 'auth0|6243762bdf154e0068d272d7',
        properties: {
          sender: {
            id: 'auth0|6243762bdf154e0068d272d7',
            name: 'Igor Omote',
            picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
          },
          task: {
            id: '65e08a748b491e52ee118057',
            name: 'msg not null'
          },
          taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
          teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
        }
      }
      amqpSender.sendMessage('notifications-microservice.notification', notification) as any
      try {
        // {
        //   content: Buffer,
        //   fields: Object,
        //   properties: Object
        // }
        const amqpSender = new AmqpConnection()
        const notificationInit = {
          messageId: randomUUID(),
          type: 'notificationInit',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: 'notificationInit'
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f',
            message: msg
          }
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notificationInit) as any
        const notificationContent = {
          messageId: randomUUID(),
          type: 'notificationContent',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: 'notificationContent'
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f',
            message: msg.content
          }
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notificationContent) as any
        const notificationContentString = {
          messageId: randomUUID(),
          type: 'notificationContentString',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: 'notificationContentString'
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f',
            message: msg.content.toString()
          }
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notificationContentString) as any
        const notificationContentStringParse = {
          messageId: randomUUID(),
          type: 'notificationContentStringParse',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: 'notificationContentStringParse'
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f',
            message: JSON.parse(msg.content.toString())
          }
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notificationContentStringParse) as any
        const data = JSON.parse(msg.content.toString())
        const notificationParse = {
          messageId: randomUUID(),
          type: 'notificationParse',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: 'parse'
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
          }
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notificationParse) as any
        const task = await taskModel.findById(data.content.id)
        const notificationTask = {
          messageId: randomUUID(),
          type: 'notificationTask',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: 'notificationTask'
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
          },
          message: task
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notificationTask) as any
        const board = await boardModel.findById(task?.boardId)
        const notificationBoard = {
          messageId: randomUUID(),
          type: 'notificationBoard',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: 'notificationBoard'
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
          },
          message: board
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notificationBoard) as any

        if (task) {
          const amqpSender = new AmqpConnection()
          const notification = {
            messageId: randomUUID(),
            type: 'provingSomething',
            timestamp: new Date().toISOString(),
            recipientId: 'auth0|6243762bdf154e0068d272d7',
            properties: {
              sender: {
                id: 'auth0|6243762bdf154e0068d272d7',
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
              userThatCommented: data.content.user,
              taskThatReceivedComment: task,
              comment: data.content.comment,
              teamId: board?.teamsIds?.[0]
            }
          )
          channel.ack(msg)
          return task
        }
      } catch (error) {
        console.error('Error finding task in database:', error)
        const amqpSender = new AmqpConnection()
        const notification = {
          messageId: randomUUID(),
          type: 'provingSomething',
          timestamp: new Date().toISOString(),
          recipientId: 'auth0|6243762bdf154e0068d272d7',
          properties: {
            sender: {
              id: 'auth0|6243762bdf154e0068d272d7',
              name: 'Igor Omote Error',
              picture: 'https://s3-sa-east-1.amazonaws.com/business.s3.getbud.co/user/pictures/335cd9ee-e5df-402c-a268-6c7a96ee7801-1657539472265.jpeg'
            },
            task: {
              id: '65e08a748b491e52ee118057',
              name: error
            },
            taskBoard: { _id: '65f83ef2275dbdbe1328502f', owner: '825112f5-6da7-4d92-a845-79a3ea355fd4', title: 'bom dia sua máquina de construir músculo', author: { type: 'USER', identifier: '825112f5-6da7-4d92-a845-79a3ea355fd4' }, status: 'toDo', boardId: '65c6585c4ae33e74c9c49a4d', dueDate: '1112-11-11T03:06:28.000Z', priority: 4, description: '<p>bom dia sua máquina de construir músculo</p>', initialDate: '1112-11-11T03:06:28.000Z', supportTeam: [] },
            teamId: '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
          }
        }
        await amqpSender.sendMessage('notifications-microservice.notification', notification) as any
      }
    }
  })
}

// https://dev.to/omardiaa48/microservices-with-expressjs-and-rabbitmq-34dk

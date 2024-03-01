import * as amqp from 'amqplib/callback_api'
import { taskModel } from './database/models'

export default async function setupAMQP (): Promise<void> {
  const rabbitmqUrl = 'amqp://localhost'
  const queueName = 'task-management-microservice.get-task'
  const routingKey = 'task-management-microservice.get-task'
  console.log('HEY BI')
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
  channel.assertExchange('bud', 'topic')// Maybe unnecessary?
  channel.assertQueue(queueName)
  channel.bindQueue(queueName, 'bud', routingKey) // Maybe unnecessary?
  channel.consume(queueName, async (msg: any) => {
    if (msg !== null) {
    //   console.log('Received message:', msg.content.toString())
    //   console.log(typeof msg.content)
    //   console.log('Received message:', JSON.parse(msg.content.toString()).id)
      try {
      // Find the task in the database
        const task = await taskModel.findById(JSON.parse(msg.content.toString()).id)

        if (task) {
          console.log('Found task in database:', task)
          channel.ack(msg)
          return task
          // Agora é mandar pro business com as infos de: task name, owner and so on
        } else {
          console.log('Task not found in database')
        }
      } catch (error) {
        console.error('Error finding task in database:', error)
      }
    }
  }, { consumerTag: 'teste' })
}

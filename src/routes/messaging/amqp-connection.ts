import * as amqp from 'amqplib/callback_api'
import { randomUUID } from 'crypto'

export default class AmqpConnection {
  private readonly rabbitmqUrl: string = 'amqp://localhost'
  private readonly exchange: string = 'bud'

  constructor () {
    this.setupRabbitMQ = this.setupRabbitMQ.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.emit = this.emit.bind(this)
  }

  private async setupRabbitMQ (): Promise<void> {
    const connection = await new Promise<amqp.Connection>((resolve, reject) => {
      amqp.connect(this.rabbitmqUrl, (err, conn) => {
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

    // Assert the exchange
    channel.assertExchange(this.exchange, 'topic')

    // Close the connection when the Node.js process exits
    process.on('exit', () => connection.close())
  }

  public async sendMessage<R>(queue: string, payload: unknown): Promise<R> {
    const connection = await new Promise<amqp.Connection>((resolve, reject) => {
      amqp.connect(this.rabbitmqUrl, (err, conn) => {
        if (err) reject(err)
        resolve(conn)
      })
    })
    return await new Promise<R>((resolve, reject) => {
      connection.createChannel((err, channel) => {
        if (err) reject(err)

        channel.assertQueue('', { exclusive: true }, (err, q) => {
          if (err) reject(err)

          const correlationId = randomUUID()

          channel.consume(
            q.queue,
            (msg) => {
              if (msg?.properties.correlationId === correlationId) {
                resolve(JSON.parse(msg.content.toString()) as R)
                setTimeout(() => {
                  connection.close()
                }, 500)
              }
            },
            { noAck: true }
          )

          channel.publish(this.exchange, queue, Buffer.from(JSON.stringify(payload)), {
            correlationId: correlationId,
            replyTo: q.queue
          })

          setTimeout(() => {
            reject(new Error('Request timed out'))
          }, requestTimeout)
        })
      })
    })
  }

  public async emit (routingKey: string, data: unknown): Promise<void> {
    return await new Promise((resolve, reject) => {
      amqp.connect(this.rabbitmqUrl, (err, connection) => {
        if (err) reject(err)

        connection.createChannel((channelErr, ch) => {
          if (channelErr) reject(channelErr)

          ch.assertExchange(this.exchange, 'topic')

          // Send the message
          ch.publish(this.exchange, routingKey, Buffer.from(JSON.stringify(data)))

          resolve()
        })
      })
    })
  }
}

const requestTimeout = 5000

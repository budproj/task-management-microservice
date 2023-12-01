import * as amqp from 'amqplib/callback_api'

export default class AmqpConnection {
  private readonly rabbitmqUrl: string = 'amqp://localhost' // Replace with your RabbitMQ server URL
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
    channel.assertExchange(this.exchange, 'direct', { durable: false })

    // Close the connection when the Node.js process exits
    process.on('exit', () => connection.close())
  }

  public async sendMessage<R>(channel: string, payload: unknown): Promise<R> {
    return await new Promise((resolve, reject) => {
      amqp.connect(this.rabbitmqUrl, (err, connection) => {
        if (err) reject(err)

        connection.createChannel((channelErr, ch) => {
          if (channelErr) reject(channelErr)

          ch.assertExchange(this.exchange, 'direct', { durable: false })

          ch.assertQueue('', { exclusive: true }, (queueErr, q) => {
            if (queueErr) reject(queueErr)

            ch.bindQueue(q.queue, this.exchange, channel)

            ch.consume(
              q.queue,
              (msg) => {
                if (msg) {
                  const response = JSON.parse(msg.content.toString()) as R
                  resolve(response)
                }
              },
              { noAck: true }
            )

            // Send the request
            ch.publish(this.exchange, channel, Buffer.from(JSON.stringify(payload)))
          })
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

          ch.assertExchange(this.exchange, 'direct', { durable: false })

          // Send the message
          ch.publish(this.exchange, routingKey, Buffer.from(JSON.stringify(data)))

          resolve()
        })
      })
    })
  }
}

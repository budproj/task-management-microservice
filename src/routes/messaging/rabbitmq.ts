import { Connection } from 'amqplib'

export class RabbitMqService {
  constructor (private readonly rabbitmq: Connection) {}

  /**
   * Sends a message to a rabbitmq channel and wait for it's response.
   *
   * @param channel the rabbitmq channel do send the message to
   * @param payload  the payload to be send
   */
  async sendMessage (channel: string, payload: unknown): Promise<any> {
    // return this.rabbitmq.<R>({
    //   exchange: 'bud',
    //   routingKey: channel,
    //   payload: payload
    // })
  }

  /**
   * Fire and forget a message to a rabbitmq topic.
   *
   * @param routingKey
   * @param data
   */
  async emit (routingKey: any, data: any): Promise<void> {
    // await this.rabbitmq.publish('bud', routingKey, data)
  }
}

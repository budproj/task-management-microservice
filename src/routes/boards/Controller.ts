import { Response } from 'express'
import { Controller } from '../../ts/abstract_classes'
import { BOARD_TYPE, IBoard, IBoardsController, Request } from '../../ts/interfaces'
import { IBoardsService } from '../../ts/interfaces/routes/boards/Service'

export class BoardsController extends Controller<IBoard> implements IBoardsController {
  constructor (protected readonly service: IBoardsService) {
    super(service)
    this.getFromTeamId = this.getFromTeamId.bind(this)
  }

  public async getFromTeamId (req: Request, res: Response): Promise<Response> {
    const body = req.body
    const teamId = req.query.teamId
    // When there are Boards related to entities other than Team we must make the type more flexible when creating a new Board
    const result = await this.service.findOrCreateFromTeams([teamId], { ...body, type: BOARD_TYPE.TEAM_TASKS })

    if (!result) {
      return res.status(404)
        .json({ message: 'No Boards were found for the boardId provided, please make sure that the board exists' })
    }

    return res.status(200).json(result)
  }

  // public async sendMessage (): Promise<any> {
  //   amqp.connect('amqp://localhost', function (error0: any, connection: Connection) {
  //     if (error0) {
  //       throw error0
  //     }
  //     connection.createChannel(async function (error1: any, channelInstance: Channel) {
  //       if (error1) {
  //         throw error1
  //       }

  //       const exchange = 'bud'
  //       const queueName = 'routines-microservice.health-check'
  //       const routingKey = 'routines-microservice.health-check'

  //       try {
  //         channelInstance.assertExchange('bud', 'topic')
  //         channelInstance.assertQueue(queueName, { deadLetterExchange: 'dead', deadLetterRoutingKey: 'dead' })
  //         channelInstance.bindQueue(queueName, exchange, routingKey)
  //         // channelInstance.sendToQueue('routines-microservice.health-check', Buffer.from(JSON.stringify({ id: 'b159ef12-9062-49c6-8afc-372e8848fb15', reply: 'routines-microservice.health-check' })))
  //         // channelInstance.publish(exchange, routingKey, Buffer.from(JSON.stringify({ id: 'b159ef12-9062-49c6-8afc-372e8848fb15', reply: 'aaaa' })))

  //         // channelInstance.consume(queueName, async (msg: any) => {
  //         //   if (msg !== null) {
  //         //     Process the message
  //         //     console.log('Received message:', msg.content.toString())
  //         //     channelInstance.ack(msg) // Acknowledge the message
  //         //     channelInstance.cancel('teste')
  //         //   }
  //         // }, { consumerTag: 'teste' })
  //       } catch (err) {
  //         console.log(err)
  //       }

  //       console.log(' [x] Sent %s', 'Hello world')
  //     })
  //   })
  // }
}

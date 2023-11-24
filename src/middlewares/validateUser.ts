import { Request, Response, NextFunction } from 'express'
import { RabbitMqService } from '../routes/messaging/rabbitmq'

export const validateUser = (req: Request, res: Response, next: NextFunction): Response | void => {
  const rabbitmq = new RabbitMqService()

  const authHeader = req.header('authorization')
  if (!authHeader) {
    return res.status(401).json({ msg: 'Header without auth' })
  }

  const [, token] = authHeader.split(' ')
  const decodedToken = await rabbitmq.sendMessage<JwtPayload>({
    exchange: 'bud',
    routingKey: 'business.core-ports.verify-token',
    payload: token
  })

  const user = await rabbitmq.sendMessage<User>({
    exchange: 'bud',
    routingKey: 'business.core-ports.get-user-with-teams-by-sub',
    payload: decodedToken.sub
  })

  req.user = {
    ...user,
    permissions: decodedToken.permissions
  }

  return next()
}

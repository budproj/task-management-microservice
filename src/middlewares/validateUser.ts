import { Request, Response, NextFunction } from 'express'

import AmqpConnection from '../routes/messaging/amqp-connection'

export const validateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const authHeader = req.header('authorization')
  if (!authHeader) {
    return res.status(401).json({ msg: 'Header without auth' })
  }

  const amqp = new AmqpConnection()

  const [, token] = authHeader.split(' ')

  const decodedToken = await amqp.sendMessage('business.core-ports.verify-token', token) as any

  if (!decodedToken || !decodedToken.sub) return res.status(401).json({ msg: 'Invalid or expired token' })

  const user = await amqp.sendMessage('business.core-ports.get-user-with-teams-by-sub', decodedToken.sub) as any

  req = {
    ...user,
    permissions: decodedToken.permissions
  }

  return next()
}

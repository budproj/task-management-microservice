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

  const user = await amqp.sendMessage('business.core-ports.get-user-with-teams-by-sub', decodedToken.sub) as any

  const userCompanies = await amqp.sendMessage('business.core-ports.get-user-companies', user)

  req = {
    ...user,
    companies: userCompanies,
    permissions: decodedToken.permissions
  }

  return next()
}

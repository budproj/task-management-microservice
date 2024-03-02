import { User } from 'src/ts/types/User.ts'

declare global {
  namespace Express {
    export interface Request {
      user?: User
    }
  }
}

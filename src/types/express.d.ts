import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        isAdmin: boolean;
      };
    }
  }
}

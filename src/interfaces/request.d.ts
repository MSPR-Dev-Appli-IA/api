import { IUser } from "./user.interface";

declare global {
    namespace Express {
      export interface Request {
        language?: Language;
        user?: User;
        sender: string|null;
        receiver: string|null;

        isAuthenticated():boolean;
      }
    }
  }
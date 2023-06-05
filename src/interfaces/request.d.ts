import { IUser } from "./user.interface";

declare global {
    namespace Express {
      export interface Request {
        language?: Language;
        user?: User;
        jwt: string;

        isAuthenticated():boolean;
      }
    }
  }
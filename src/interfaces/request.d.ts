import { IUser } from "./user.interface";

declare global {
    namespace Express {
      export interface Request {
        language?: Language;
        user?: User;

        logout():void;
        login(User:IUser):void;
        isAuthenticated():boolean;
      }
    }
  }
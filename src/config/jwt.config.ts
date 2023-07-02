import { NextFunction, Request, Response } from "express";
import {JwtService} from "../services/jwtService";
import {UserService} from "../services/userService";
import {JwtPayload} from "jsonwebtoken";
import {return401Errors} from "../utils";

const jwtService = new JwtService();
const userService = new UserService();

export const extractUserFromToken = async (req:Request, res:Response, next:NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    try {
      const decodedTokenCheck = await jwtService.decodeJwtToken(token)
      const userInfo = await userService.checkUserExist(decodedTokenCheck.sub as string)

      /*
       * Get the id of the user in the JWT token and check if it exists in database
       *  If it's not exist throw 404 errors
       */

      req.user = userInfo
      next();

    } catch (error) {
      return401Errors(error, res)
    }
  } else {
    next();
  }
}

export const addJwtFeatures = (req:Request, _res:Response, next:NextFunction) => {
  // req.isAuthenticated = () => !!req.user
  req.isAuthenticated = () => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1]
      return !!processJwtToken(token)
    }
    return false
  }
  next()
};

async function processJwtToken(token: string): Promise<JwtPayload | string> {
  return await jwtService.decodeJwtToken(token)
}
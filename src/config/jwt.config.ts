import { NextFunction, Request, Response } from "express";
import {JwtError, JwtService} from "../services/jwtService";
import {UserService} from "../services/userService";
import {JwtPayload} from "jsonwebtoken";

const jwtService = new JwtService();
const userService = new UserService();

export const extractUserFromToken = async (req:Request, res:Response, next:NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    try {
      const decodedTokenCheck = await jwtService.decodeJwtToken(token)

      /*
       * Get the id of the user in the JWT token and check if it exists in database
       *  If it's not exist throw 404 errors
       */
      req.user = (decodedTokenCheck) ? await userService.checkUserExist(decodedTokenCheck.sub as string) : res.status(404).send({
        field: ["error"],
        message: ["User not Found. Please contact us."]
      })

      next();

    } catch (error) {
      if(error instanceof JwtError){
        res.status(401).send({
          field: ["error"],
          message: [error.message]
        })
      }else{
        res.status(401).send({
          field: ["error"],
          message: ["Bad token. You must to logged in before"]
        })
      }
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

import { NextFunction, Request, Response } from "express";


export const postContentMessage = async (_: Request, res: Response, __: NextFunction) => {
  
    res.status(404).send({ message: "Error" });
  
};


export const postImageMessage = async (_: Request, res: Response, __: NextFunction) => {
  
    res.status(404).send({ message: "Error" });
  
};



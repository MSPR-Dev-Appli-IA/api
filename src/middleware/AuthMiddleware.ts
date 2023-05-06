import { NextFunction, Request, Response } from "express";

export const requireAuth = (req:Request, res:Response, next:NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(404).send({ message: "Your are not logged in" });
  }
};

export const notRequireAuth = (req:Request, res:Response, next:NextFunction) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(404).send({ message: "Your are  logged in" });
  }
};



export const isItBotanist = (req:Request, res:Response, next:NextFunction) => {
  if (req.user.role.name =="Botanist" || req.user.role.name =="Admin") {
    next();
  } else {
    res.status(404).send( { message: "Your are not allowed" });
  }
};





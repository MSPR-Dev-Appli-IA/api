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
    res.status(304).send({ field: ["error"], message: ["Your are always logged."] });
  }
};



export const isItBotanist = (req:Request, res:Response, next:NextFunction) => {
  if (req.user.role.name =="Botanist" || req.user.role.name =="Admin") {
    next();
  } else {
    res.status(401).send( { field: ["error"], message: ["Bad token or Invalid Permission."] });
  }
};





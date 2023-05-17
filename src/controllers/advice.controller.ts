
import { NextFunction, Request, Response } from "express";
import { findLimitedAdvicesNotTaken } from "../queries/advice.queries";

const limit = 5

export const getAdvicesNotTaken= async (req: Request, res: Response, __: NextFunction) => {

    try {
        let { page=1, order } = req.body;
        order = order == "ASC" ? 1 :-1
        const skip:number =  limit * page - limit;
        const advices = await findLimitedAdvicesNotTaken(limit,skip,order)
        res.status(200).json( advices );
      } catch (e) {
        res.status(404).send({ message: "Error" });
      }
  
};

export const getMyAdvices = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });
  
};

export const getMyAdvicesBotanist = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });
  
};
export const getOneAdvice= async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });
  
};

export const createAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });
  
};

export const takeOneAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });
  
};
export const removeAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });
  
};
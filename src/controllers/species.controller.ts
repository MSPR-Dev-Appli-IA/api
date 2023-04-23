import { NextFunction, Request, Response } from "express";
import {findLimitedSpecies} from "../queries/species.queries"


const limit:number = 5

export const getSpecies  = async (req:Request, res:Response, _:NextFunction) => {
    let { page=1, order, search } = req.body;
    order = order == "ASC" ? 1 :-1
    const skip:number =  limit * page - limit;

    findLimitedSpecies(limit,skip,order,search)
    res.status(404).json( "error" );
    
  };





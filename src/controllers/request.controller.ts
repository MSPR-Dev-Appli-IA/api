import { NextFunction, Request, Response } from "express";
import  mongoose from 'mongoose';
import { createRequest, deleteRequestWithId, getOneRequestById, setStatutRequestToAccept, setStatutRequestToRefuse } from "../queries/request.queries";
import { findOnePlantSittinWithRequest, findOnePlantSitting, setTakenPlantSittingTrue } from "../queries/plantSitting.queries";
import { deleteMessage } from "./message.controller";

export const getOneRequest = async (req: Request, res: Response, __: NextFunction) => {
    
    try {
        const requestId = req.params.requestId;
        const request = await  getOneRequestById(new  mongoose.Types.ObjectId(requestId.trim()))
        if(request){
          res.status(200).json( request );
        }else{
        res.status(404).send({ message: "Cette request n'existe pas" });
        }
      } catch (e) {
        res.status(404).send({ message: "Erreur" });
      }
    
};


export const newRequest= async (req: Request, res: Response, __: NextFunction) => {
    
  try {
    const plantSittingId = req.params.plantSittingId;
    const plantSitting = await  findOnePlantSitting(new  mongoose.Types.ObjectId(plantSittingId.trim()))


    if (plantSitting){
        const newRequest = await  createRequest(req.user,plantSitting)
      
        res.status(200).json( newRequest );
    }else{
    res.status(404).send({ message: "Cettedemande de gardiennage  n'existe pas" });
    }
   
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }

};


export const acceptRequest = async (req: Request, res: Response, __: NextFunction) => {
  try {
    const requestId = req.params.requestId;
    const request = await  getOneRequestById(new  mongoose.Types.ObjectId(requestId.trim()))
    if(request){
      const plantSitting = await findOnePlantSittinWithRequest(new mongoose.Types.ObjectId(request.plantSitting._id.trim()))
      if (plantSitting){
        await plantSitting.requests.reduce(async (a, conv) => {
          // Wait for the previous item to finish processing
          await a;
          if (!conv._id.equals(request._id)){
            await setStatutRequestToRefuse(new  mongoose.Types.ObjectId(conv._id.trim()))
          }
          
        }, Promise.resolve());
        await setStatutRequestToAccept(new mongoose.Types.ObjectId(request._id.trim()))
        await setTakenPlantSittingTrue(new mongoose.Types.ObjectId(plantSitting._id.trim()))
        res.status(200).json( request);
      }else{
        res.status(404).send({ message: "Erreur" });
      }


      
    }else{
    res.status(404).send({ message: "Cette request n'existe pas" });
    }
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }
   

};


export const refuseRequest = async (req: Request, res: Response, __: NextFunction) => {
    
  try {
    const requestId = req.params.requestId;
    const request = await  getOneRequestById(new  mongoose.Types.ObjectId(requestId.trim()))
    if(request){
      const requestUpdated = await setStatutRequestToRefuse(new  mongoose.Types.ObjectId(requestId.trim()))
      res.status(200).json( requestUpdated );
    }else{
    res.status(404).send({ message: "Cette request n'existe pas" });
    }
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }

};


export const removeRequest = async (req: Request, res: Response, __: NextFunction) => {
    
  try {
    const requestId = req.params.requestId
    const request = await  getOneRequestById(new  mongoose.Types.ObjectId(requestId.trim()))
    if (request){
      await request.messages.reduce(async (a, mess) => {
        // Wait for the previous item to finish processing
        await a;
        await deleteMessage(mess._id)
      }, Promise.resolve());
    await deleteRequestWithId(new  mongoose.Types.ObjectId(requestId.trim()))
    res.status(200).send()
    }
    else{
      res.status(404).send("Cet request  n'existe pas");
    }

  } catch (e) {
    res.status(404).send("error");
  }

};
























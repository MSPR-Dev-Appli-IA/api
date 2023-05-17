import { NextFunction, Request, Response } from "express";
import  mongoose from 'mongoose';
import { createConversation, getOneConversationById } from "../queries/conversation.queries";
import { findOnePlantSitting } from "../queries/plantSitting.queries";

export const getOneConversation = async (req: Request, res: Response, __: NextFunction) => {
    
    try {
        const conversationId = req.params.conversationId;
        const conversation = await  getOneConversationById(new  mongoose.Types.ObjectId(conversationId.trim()))
        if(conversation){
          res.status(200).json( conversation );
        }else{
        res.status(404).send({ message: "Cette conversation n'existe pas" });
        }
      } catch (e) {
        res.status(404).send({ message: "Erreur" });
      }
    
};


export const newConversation= async (req: Request, res: Response, __: NextFunction) => {
    
  try {
    const plantSittingId = req.params.plantSittingId;
    const plantSitting = await  findOnePlantSitting(new  mongoose.Types.ObjectId(plantSittingId.trim()))


    if (plantSitting){
        const newConversation = await  createConversation(req.user,plantSitting)
      
        res.status(200).json( newConversation );
    }else{
    res.status(404).send({ message: "Cettedemande de gardiennage  n'existe pas" });
    }
   
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }

};


export const acceptConversation = async (_: Request, res: Response, __: NextFunction) => {
    
    res.status(404).send({ message: "Error" });

};


export const refuseConversation = async (_: Request, res: Response, __: NextFunction) => {
    
    res.status(404).send({ message: "Error" });

};


export const removeConversation = async (_: Request, res: Response, __: NextFunction) => {
    
    res.status(404).send({ message: "Error" });

};

























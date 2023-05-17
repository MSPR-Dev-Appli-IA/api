import { NextFunction, Request, Response } from "express";
import  mongoose from 'mongoose';
import { createConversation, deleteConversationWithId, getOneConversationById, setStatutConversationToAccept, setStatutConversationToRefuse } from "../queries/conversation.queries";
import { findOnePlantSittinWithConversation, findOnePlantSitting, setTakenPlantSittingTrue } from "../queries/plantSitting.queries";

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


export const acceptConversation = async (req: Request, res: Response, __: NextFunction) => {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await  getOneConversationById(new  mongoose.Types.ObjectId(conversationId.trim()))
    if(conversation){
      const plantSitting = await findOnePlantSittinWithConversation(new mongoose.Types.ObjectId(conversation.plantSitting._id.trim()))
      if (plantSitting){
        await plantSitting.conversations.reduce(async (a, conv) => {
          // Wait for the previous item to finish processing
          await a;
          if (!conv._id.equals(conversation._id)){
            await setStatutConversationToRefuse(new  mongoose.Types.ObjectId(conv._id.trim()))
          }
          
        }, Promise.resolve());
        await setStatutConversationToAccept(new mongoose.Types.ObjectId(conversation._id.trim()))
        await setTakenPlantSittingTrue(new mongoose.Types.ObjectId(plantSitting._id.trim()))
        res.status(200).json( conversation);
      }else{
        res.status(404).send({ message: "Erreur" });
      }


      
    }else{
    res.status(404).send({ message: "Cette conversation n'existe pas" });
    }
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }
   

};


export const refuseConversation = async (req: Request, res: Response, __: NextFunction) => {
    
  try {
    const conversationId = req.params.conversationId;
    const conversation = await  getOneConversationById(new  mongoose.Types.ObjectId(conversationId.trim()))
    if(conversation){
      const conversionUpdated = await setStatutConversationToRefuse(new  mongoose.Types.ObjectId(conversationId.trim()))
      res.status(200).json( conversionUpdated );
    }else{
    res.status(404).send({ message: "Cette conversation n'existe pas" });
    }
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }

};


export const removeConversation = async (req: Request, res: Response, __: NextFunction) => {
    
  try {
    const conversationId = req.params.conversationId
    const conversation = await  getOneConversationById(new  mongoose.Types.ObjectId(conversationId.trim()))
    if (conversation){
    await deleteConversationWithId(new  mongoose.Types.ObjectId(conversationId.trim()))
    res.status(200).send()
    }
    else{
      res.status(404).send("Cet conversation  n'existe pas");
    }

  } catch (e) {
    res.status(404).send("error");
  }

};

























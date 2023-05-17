
import { NextFunction, Request, Response } from "express";
import { findLimitedAdvicesFoOnePlant, findLimitedAdvicesNotTaken,findLimitedAdvicesOfBotanist,getOneAdviceById,takeAnAdviceByAdviceId,deleteAdviceWithId,createAdviceWithPlantId,addImageWithAdviceId } from "../queries/advice.queries";
import mongoose from 'mongoose';
import * as fs from 'fs';
import { deleteImage } from "../queries/image.queries";
import { deleteMessage } from "./message.controller";
import  { ValidationError } from "joi";
import { adviceValidation } from "../database/validation/advice.validation";
import { newImage } from "./image.controller";
const limit = 5

export const getAdvicesNotTaken = async (req: Request, res: Response, __: NextFunction) => {

    try {
        let { page = 1, order } = req.body;
        order = order == "ASC" ? 1 : -1
        const skip: number = limit * page - limit;
        const advices = await findLimitedAdvicesNotTaken(limit, skip, order)
        res.status(200).json(advices);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }
};


export const getMyAdvicesForOnePlant = async (req: Request, res: Response, __: NextFunction) => {

    try {
        let { page = 1, order } = req.body;
        const plantId = req.params.plantId
        order = order == "ASC" ? 1 : -1
        const skip: number = limit * page - limit;
        const advices = await findLimitedAdvicesFoOnePlant(limit, skip, order, new mongoose.Types.ObjectId(plantId.trim()))
        res.status(200).json(advices);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }

};

export const getMyAdvicesBotanist = async (req: Request, res: Response, __: NextFunction) => {
    try {
        let { page = 1, order } = req.body;

        order = order == "ASC" ? 1 : -1
        const skip: number = limit * page - limit;
        const advices = await findLimitedAdvicesOfBotanist(limit, skip, order, req.user._id)
        res.status(200).json(advices);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }


};
export const getOneAdvice = async (req: Request, res: Response, __: NextFunction) => {

    try {
        const adviceId = req.params.adviceId
        const advice = await getOneAdviceById (new mongoose.Types.ObjectId(adviceId.trim()))
        res.status(200).json(advice);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }

};

export const createAdvice = async (req: Request, res: Response, __: NextFunction) => {

    try {
        await adviceValidation.validateAsync(req.body, { abortEarly: false });
        const {content } = req.body
        const plantId = req.params.plantId
        const advice = await createAdviceWithPlantId(content,new mongoose.Types.ObjectId(plantId.trim()));
        res.status(200).send(advice);
      } catch (e) {
        const errors = [];
        if (e instanceof ValidationError) {
          e.details.map((error) => {
            errors.push({ field: error.path[0], message: error.message });
          });
        }else {
          errors.push({ field: "error", message: e })
      }
        res.status(404).send({  errors });
      }

};

export const updateAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });

};

export const removeImageFromAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });

};
export const addImageFromAdvice= async (req: Request, res: Response, __: NextFunction) => {

    try {
        const file = req.file as Express.Multer.File
        const adviceId = req.params.adviceId;
  
        if (file){
          const imageAdvice = await  newImage(file)
          const newSpecies = await addImageWithAdviceId(imageAdvice,new  mongoose.Types.ObjectId(adviceId.trim()))
          res.status(200).send(newSpecies);
        }else{
          res.status(404).send("No file");
        }
      } catch (e) {
        res.status(404).send("error");
      }

};


export const takeOneAdvice = async (req: Request, res: Response, __: NextFunction) => {

    try {
        const adviceId = req.params.adviceId
        const advice = await getOneAdviceById (new mongoose.Types.ObjectId(adviceId.trim()))
        if (advice){
            const newAdvice = await takeAnAdviceByAdviceId(advice._id,req.user._id)
            res.status(200).json(newAdvice);
        }
     
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }

};
export const removeAdvice = async (req: Request, res: Response, __: NextFunction) => {

    try {
        const adviceId = req.params.adviceId
        const advice = await getOneAdviceById (new mongoose.Types.ObjectId(adviceId.trim()))
        if (advice){
            await advice.images.reduce(async (a, image) => {
                // Wait for the previous item to finish processing
                await a;
                fs.unlinkSync("public/image/" + image.path);
                await deleteImage(image._id)
              }, Promise.resolve());

              await advice.messages.reduce(async (a, mess) => {
                // Wait for the previous item to finish processing
                await a;
                await deleteMessage(mess._id)
              }, Promise.resolve());
              await deleteAdviceWithId(advice._id)
              res.status(200).send()
        } else{
            res.status(404).send("Ce conseil  n'existe pas");
          }
     
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }


};
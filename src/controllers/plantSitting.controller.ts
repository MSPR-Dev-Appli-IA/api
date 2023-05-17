
import { NextFunction, Request, Response } from "express";
import { findPlantSittingsNotTakenAndNotBegin, findOnePlantSitting, findOnePlantSittinWithConversation, deletePlantSittingWithPlantSittingId, createPlantSitting, updatePlantSittingWithPlantSittingsId } from "../queries/plantSitting.queries";
import { plantSittingValidation } from "../database/validation/plantSitting.validation";
import { getAddressFromLabel } from "./address.controller";
import mongoose from 'mongoose';
import { ValidationError } from "joi";
import { deleteConversationWithId } from "../queries/conversation.queries";

export const getPlantSitting = async (_: Request, res: Response, __: NextFunction) => {
  try {
    const plantSitting = await findPlantSittingsNotTakenAndNotBegin()
    res.status(200).json(plantSitting);
  } catch (e) {
    res.status(404).send({ message: "Error" });
  }
};


export const getOnePlantSitting = async (req: Request, res: Response, __: NextFunction) => {
  try {
    const plantSittingId = req.params.plantSittingId;
    const plantSitting = await findOnePlantSitting(new mongoose.Types.ObjectId(plantSittingId.trim()))
    if (plantSitting) {
      res.status(200).json(plantSitting);
    } else {
      res.status(404).send({ message: "Ce gardiennage de plante  n'existe pas" });
    }
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }


};

export const getOnePlantSittingWithConversation = async (req: Request, res: Response, __: NextFunction): Promise<void> => {
  try {
    const plantSittingId = req.params.plantSittingId;
    const plantSitting = await findOnePlantSittinWithConversation(new mongoose.Types.ObjectId(plantSittingId.trim()))
    if (plantSitting) {
      res.status(200).json(plantSitting);
    } else {
      res.status(404).send({ message: "Ce gardiennage de plante  n'existe pas" });
    }
  } catch (e) {
    res.status(404).send({ message: "Erreur" });
  }


};



export const newPlantSitting = async (req: Request, res: Response, __: NextFunction) => {

  try {
    await plantSittingValidation.validateAsync(req.body, { abortEarly: false });
    let { title, description, start_at, end_at, address } = req.body
    const addressObject = await getAddressFromLabel(address)
    if (addressObject) {
      const newPlantSitting = await createPlantSitting(title, description, start_at, end_at, addressObject)
      res.status(200).json(newPlantSitting);
    } else {
      res.status(404).send({ message: "Cette addresse n'existe pas " });
    }

  } catch (e) {
    const errors = [];
    if (e instanceof ValidationError) {
      e.details.map((error) => {
        errors.push({ field: error.path[0], message: error.message });
      });
    } else {
      errors.push({ field: "error", message: "Erreur" })
    }
    res.status(404).send({ errors });
  }

};

export const updatePlantSitting = async (req: Request, res: Response, __: NextFunction) => {

  try {
    await plantSittingValidation.validateAsync(req.body, { abortEarly: false });
    const plantSittingId = req.params.plantSittingId;
    let { title, description, start_at, end_at, address } = req.body
    const addressObject = await getAddressFromLabel(address)
    if (addressObject) {
      const newPlantSitting = await updatePlantSittingWithPlantSittingsId(new mongoose.Types.ObjectId(plantSittingId.trim()), title, description, start_at, end_at, addressObject)
      res.status(200).json(newPlantSitting);
    } else {
      res.status(404).send({ message: "Cette addresse n'existe pas " });
    }

  } catch (e) {
    const errors = [];
    if (e instanceof ValidationError) {
      e.details.map((error) => {
        errors.push({ field: error.path[0], message: error.message });
      });
    } else {
      errors.push({ field: "error", message: "Erreur" })
    }
    res.status(404).send({ errors });
  }

};



export const removePlantSitting = async (req: Request, res: Response, __: NextFunction) => {
  try {
    const plantSittingId = req.params.plantSittingId;
    const plantSitting = await findOnePlantSitting(new mongoose.Types.ObjectId(plantSittingId.trim()))
    if (plantSitting) {
      await plantSitting.conversations.reduce(async (a, conv) => {
        // Wait for the previous item to finish processing
        await a;
        await deleteConversationWithId(conv._id)
      }, Promise.resolve());

      await deletePlantSittingWithPlantSittingId(new mongoose.Types.ObjectId(plantSittingId.trim()))
      res.status(200).send()
    }
    else {
      res.status(404).send("Cet plante n'existe pas  n'existe pas");
    }

  } catch (e) {
    res.status(404).send("error");

  }
}


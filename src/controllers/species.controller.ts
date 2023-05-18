import { NextFunction, Request, Response } from "express";
import {findLimitedSpecies,findOneSpecies,createSpecies,updateSpecieWithSpeciesId,addImageWithSpeciesId,deleteImageWithSpeciesId,deleteSpeciesWithSpeciesId} from "../queries/species.queries"
import { deleteImage ,getImageById} from "../queries/image.queries";
import  { ValidationError } from "joi";
import { newImage } from "./image.controller";
import  mongoose from 'mongoose';
import * as fs from 'fs';
import {createSpeciesValidation, updateSpeciesValidation} from "../database/validation/species.validation";

const limit:number = 5
const API_HOSTNAME = (process.env.API_HOSTNAME) ? process.env.API_HOSTNAME : ""
const API_VERSION = (process.env.API_VERSION) ? process.env.API_VERSION : ""

export const getSpecies = async (req: Request, res: Response, _: NextFunction) => {
  try {
    let {page = 1, order, search} = req.body;
    order = order == "ASC" ? 1 : -1
    const skip: number = limit * page - limit;
    const species = await findLimitedSpecies(limit, skip, order, search)
    const result: any[] = []

    species.forEach(item => {
      result.push({
          name: item.name,
          url: API_HOSTNAME + "/api" + API_VERSION + "/species/" + item._id,
          images: item.images,
          sunExposure: item.sunExposure,
          watering: item.watering,
          optimalTemperature: item.optimalTemperature
        })
    })

    res.status(200).json(result);
  } catch (e) {
    res.status(500).send({
      field: ["error"],
      message: ["An error was occurred. Please contact us"]
    });
  }
};

export const getOneSpecies = async (req: Request, res: Response, _: NextFunction) => {
  try {
    const speciesId = req.params.speciesId;
    const species = await findOneSpecies(new mongoose.Types.ObjectId(speciesId.trim()))
    if (species) {
      res.status(200).json(species);
      return ;
    }
    res.status(404).send({
      field: ["error"],
      message: ["Species not Found."]
    });
  } catch (e) {
    res.status(500).send({
      field: ["error"],
      message: ["An error was occurred. Please contact us."]
    });
  }
};

  export const updateSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const speciesId = req.body.speciesId;

      await updateSpeciesValidation.validateAsync(req.body, { abortEarly: false });
      const updateSpecies = await updateSpecieWithSpeciesId(new  mongoose.Types.ObjectId(speciesId.trim()),req.body);

      if(updateSpecies){
        res.status(200).json({
          status: "success",
          path: API_HOSTNAME + "/api" + API_VERSION + "/species/" + speciesId
        })
      }else{
        res.status(404).send({
          field: ["error"],
          message: ["Species not Found."]
        })
      }

    } catch (e) {
      const field: any[] = [];
      const message: any[] = [];
      if (e instanceof ValidationError) {
        e.details.forEach(item => {
          field.push(item.path[0])
          message.push(item.message)
        });

        res.status(400).send({
          field: field,
          message: message
        });
        return;
      }
      res.status(500).send({
        field: ["error"],
        message: ["An error was occurred. Please contact us"]
      });
    }
    
  };



  export const newSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      await createSpeciesValidation.validateAsync(req.body, { abortEarly: false });
      const species = await createSpecies(req.body);
      res.status(200).send(species);
    } catch (e) {
      const field: any[] = [];
      const message: any[] = [];
      if (e instanceof ValidationError) {
        e.details.forEach(item => {
          field.push(item.path[0])
          message.push(item.message)
        });

        res.status(400).send({
          field: field,
          message: message
        });
      }else {
        res.status(500).send({
          field: ["error"],
          message: ["An error was occurred. Please contact us"]
        });
      }
    }
  };







  export const addImageFromSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const file = req.file as Express.Multer.File
      const speciesId = req.params.speciesId;

      if (file){
        const imageSpecies = await  newImage(file)
        const newSpecies = await addImageWithSpeciesId(imageSpecies,new  mongoose.Types.ObjectId(speciesId.trim()))
        res.status(200).send(newSpecies);
      }else{
        res.status(404).send("No file");
      }
    } catch (e) {
      res.status(404).send("error");
    }
  };



  //  add transaction for this one 
  export const removeImageFromSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const speciesId = req.params.speciedId
      const imageId = req.params.imageId
      const image = await  getImageById(imageId)
      if(image){
      const newSpecies = await deleteImageWithSpeciesId(image._id,new  mongoose.Types.ObjectId(speciesId.trim()))
      fs.unlinkSync("public/image/" + image.path);
      await deleteImage(imageId)
      res.status(200).send(newSpecies);
      }else{
        res.status(404).send("Cet image n'existe pas");
      }
      

    } catch (e) {
      res.status(404).send("error");
    }
    
  };

export const removeSpecies = async (req: Request, res: Response, _: NextFunction) => {
  try {
    const speciesId = req.params.speciedId
    const species = await findOneSpecies(new mongoose.Types.ObjectId(speciesId.trim()))
    if (species) {
      for (const image of species.images) {
        fs.unlinkSync("public/image/" + image.path);
        await deleteImage(image._id)
      }
      await deleteSpeciesWithSpeciesId(new mongoose.Types.ObjectId(speciesId.trim()))
      res.status(204).send()
      return ;
    }
    res.status(404).send({
      field: ["error"],
      message: ["Species not Found."]
    });

  } catch (e) {
    res.status(500).send({
      field: ["error"],
      message: ["An error was occurred. Please contact us."]
    });
  }

};
import { NextFunction, Request, Response } from "express";
import {findLimitedPlantsByUserIdAndSpeciesId,findOnePlant,createPlant,addImageWithPlantId,deleteImageWithPlantId ,deletePlantsWithPlantsId,updatePlantWithPlantId} from "../queries/plant.queries"
import { findOneSpecies, } from "../queries/species.queries";
import  mongoose from 'mongoose';
import { newImage } from "./image.controller";
import { deleteImage ,getImageById} from "../queries/image.queries";
import  { plantValidation} from "../database/validation/plant.validation"
import  { ValidationError } from "joi";
import * as fs from 'fs';

const limit:number = 5

export const getMyPlants = async (req: Request, res: Response, _: NextFunction) => {
    try {
        let { page=1, order,search,speciesId } = req.body;
        order = order == "ASC" ? 1 :-1
        const skip:number =  limit * page - limit;
        const plants = await findLimitedPlantsByUserIdAndSpeciesId(req.user._id,speciesId,limit,skip,order,search)
        res.status(200).json( plants );
      } catch (e) {
        res.status(404).send({ message: e });
      }
};


export const getOneOfMyPlant = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const plantId = req.params.plantId;
        const plant = await findOnePlant(new  mongoose.Types.ObjectId(plantId.trim()))
        if(plant){
          res.status(200).json( plant );
        }else{
        res.status(404).send({ message: "Cette plante n'existe pas" });
        }
      } catch (e) {
        res.status(404).send({ message: "Erreur" });
      }
      
};
export const newPlant = async (req: Request, res: Response, _: NextFunction) => {
    try {
        let { speciesId,name  } = req.body;

        const species = await findOneSpecies(speciesId)
        if (species){
            const newPlant = await  createPlant(species._id,req.user._id,name? name: "Ma plante ( " + species.name + " )")
            
            res.status(200).json( newPlant );
        }else{
        res.status(404).send({ message: "Cette espece de  plante n'existe pas" });
        }
       
      } catch (e) {
        res.status(404).send({ message: "Erreur" });
      }
      
};

export const updatePlant = async (req: Request, res: Response, _: NextFunction) => {
  try {
    const plantId = req.params.plantId;
    await plantValidation.validateAsync(req.body, { abortEarly: false });
    const plant = await updatePlantWithPlantId(new  mongoose.Types.ObjectId(plantId.trim()),req.body);
    res.status(200).json( plant );

  } catch (e) {
    const errors = [];
    if (e instanceof ValidationError) {
      e.details.map((error) => {
        errors.push({ field: error.path[0], message: error.message });
      });
    }else {
      errors.push({ field: "error", message: e })
  }
  console.log(e)
    res.status(404).send({  errors });
  }
    
};

export const addImageFromPlant = async (req: Request, res: Response, _: NextFunction) => {
    try {
      
        const file = req.file as Express.Multer.File
        const plantId = req.params.plantId;
  
        if (file){
          const imagePlants = await  newImage(file)
          const newImagePlant = await addImageWithPlantId(imagePlants,new  mongoose.Types.ObjectId(plantId.trim()))
          res.status(200).send(newImagePlant);
        }else{
          res.status(404).send("No file");
        }
      } catch (e) {
        res.status(404).send("error");
      }
      
};
export const removeImageFromPlant= async (req: Request, res: Response, _: NextFunction) => {
    try {
     
        const plantId = req.params.plantId
        const imageId = req.params.imageId
        const image = await  getImageById(imageId)
        if(image){
        const newPlant = await deleteImageWithPlantId(image._id,new  mongoose.Types.ObjectId(plantId.trim()))
        fs.unlinkSync("public/image/" + image.path);
        await deleteImage(imageId)
        res.status(200).send(newPlant);
        }else{
          res.status(404).send("Cet image n'existe pas");
        }
        
  
      } catch (e) {
        res.status(404).send("error");
      }
      
};
export const removePlant = async (req: Request,res: Response, _: NextFunction) => {
  try {
    const plantId = req.params.plantId
    const plant = await findOnePlant(new  mongoose.Types.ObjectId(plantId.trim()))
    if (plant){
      plant.images.forEach(async(image) => {
        fs.unlinkSync("public/image/" + image.path);
        await deleteImage(image._id)
      });
    await deletePlantsWithPlantsId(new  mongoose.Types.ObjectId(plantId.trim()))
    res.status(200).send()
    }
    else{
      res.status(404).send("Cet plante n'existe pas  n'existe pas");
    }

  } catch (e) {
    res.status(404).send("error");
  }
};
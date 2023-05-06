import { NextFunction, Request, Response } from "express";
import {findLimitedSpecies,findOneSpecies,createSpecies,updateSpecieWithSpeciesId,addImageWithSpeciesId,deleteImageWithSpeciesId,deleteSpeciesWithSpeciesId} from "../queries/species.queries"
import { deleteImage ,getImageById} from "../queries/image.queries";
import {speciesValidation} from "../database/validation/species.validation"
import  { ValidationError } from "joi";
import { newImage } from "./image.controller";
import * as fs from 'fs';

const limit:number = 5

export const getSpecies  = async (req:Request, res:Response, _:NextFunction) => {
  try {
    let { page=1, order, search } = req.body;
    order = order == "ASC" ? 1 :-1
    const skip:number =  limit * page - limit;
    const species = await findLimitedSpecies(limit,skip,order,search)
    res.status(200).json( species );
  } catch (e) {
    res.status(404).json( "error" );
  }
  };

  export const getOneSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const speciesId = req.params.speciesId;
      const species = await findOneSpecies(speciesId)
      if(species){
        res.status(200).json( species );
      }else{
      res.status(404).send("Cette espece de plante n'existe pas ");
      }
    } catch (e) {
      res.status(404).send("error");
    }
    
  };

  export const updateSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const speciesId = req.params.speciesId;
      await speciesValidation.validateAsync(req.body, { abortEarly: false });
      const species = await updateSpecieWithSpeciesId(speciesId,req.body);
      res.status(200).json( species );
 
    } catch (e) {
      res.status(404).send("error");
    }
    
  };



  export const newSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      await speciesValidation.validateAsync(req.body, { abortEarly: false });
      const species = await createSpecies(req.body);
      res.status(200).send(species);
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







  export const addImageFromSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const file = req.file as Express.Multer.File
      const speciesId = req.params.speciesId;

      if (file){
        const imageSpecies = await  newImage(file)
        const newSpecies = await addImageWithSpeciesId(imageSpecies,speciesId)
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
      const newSpecies = await deleteImageWithSpeciesId(imageId,speciesId)
      fs.unlinkSync("src/public/image/" + image.path);
      await deleteImage(imageId)
      res.status(200).send(newSpecies);
      }else{
        res.status(404).send("Cet image n'existe pas");
      }
      

    } catch (e) {
      res.status(404).send("error");
    }
    
  };

  export const removeSpecies = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const speciesId = req.params.speciedId
      const species = await findOneSpecies(speciesId)
      if (species){
        species.images.forEach(async(image) => {
          fs.unlinkSync("src/public/image/" + image.path);
          await deleteImage(image._id)
        });
      await deleteSpeciesWithSpeciesId(speciesId)
      res.status(200).send()
      }
      else{
        res.status(404).send("Cet espece de plante n'existe pas  n'existe pas");
      }

    } catch (e) {
      res.status(404).send("error");
    }
    
  };
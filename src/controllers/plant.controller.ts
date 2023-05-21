import { NextFunction, Request, Response } from "express";
import {findLimitedPlantsByUserIdAndSpeciesId,findOnePlant,createPlant,addImageWithPlantId,deleteImageWithPlantId ,deletePlantsWithPlantsId,updatePlantWithPlantId} from "../queries/plant.queries"
import { findOneSpecies, } from "../queries/species.queries";
import  mongoose from 'mongoose';
import { newImage } from "./image.controller";
import { deleteImage ,getImageById} from "../queries/image.queries";
import {
    getMyPlantsValidation,
    getOneOfMyPlantValidation,
    plantValidation
} from "../database/validation/plant.validation"
import * as fs from 'fs';
import {API_HOSTNAME, API_VERSION, return400or500Errors} from "../utils";

const limit:number = 5

export const getMyPlants = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const speciesId = (req.query.speciesId) ? String(req.query.speciesId) : ""
        const search = (req.query.search) ? String(req.query.search) : ""
        const page = (req.query.page) ? Number(req.query.page) : Number(1)
        const order = (req.query.order == "ASC") ? 1  : -1

        await getMyPlantsValidation.validateAsync(req.query, {abortEarly: false});

        const skip:number =  limit * page - limit;
        const plants = await findLimitedPlantsByUserIdAndSpeciesId(req.user._id,speciesId,limit,skip,order,search)
        if(plants){
            const result: any[] = []
            plants.forEach(item => {
                result.push({
                    _id: item._id,
                    name: item.name,
                    plantInfo: API_HOSTNAME + "/api" + API_VERSION + "/plant/" + item._id,
                    speciesInfo: API_HOSTNAME + "/api" + API_VERSION + "/species/" + item.species._id
                })
            })

            res.status(200).json({result});
        }else{
            res.status(404).json({
                "field": ["error"],
                "message": ["Not species found."]
            })
        }
      } catch (e) {
        return400or500Errors(e, res)
      }
};


export const getOneOfMyPlant = async (req: Request, res: Response, _: NextFunction) => {
    try {
        await getOneOfMyPlantValidation.validateAsync(req.params, {abortEarly: false});

        const plant = await findOnePlant(req.params.plantId)
        if(plant){
            res.status(200).send({
                _id: plant._id,
                name: plant.name,
                images: plant.images,
                created_at: plant.created_at,
                speciesInfo: API_HOSTNAME + "/api" + API_VERSION + "/species/" + plant.species._id
            })
        }
      } catch (e) {
        return400or500Errors(e, res)
      }
};

export const newPlant = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const plantName = req.body.name
        const userId = req.user._id
        const speciesId = req.body.speciesId

        await plantValidation.validateAsync(req.body, {abortEarly: false});

        const species = await findOneSpecies(speciesId)
        if (species){
            const newPlant = await createPlant(speciesId,userId,plantName)
            
            res.status(200).send({
                status: "success",
                plantInfo: API_HOSTNAME + "/api" + API_VERSION + "/plant/" + newPlant._id
            });
        }else{
            res.status(404).send({
                field: ["error"],
                message: ["Species not Found"]
            });
        }
      } catch (e) {
        return400or500Errors(e, res)
      }
      
};

export const updatePlant = async (req: Request, res: Response, _: NextFunction) => {
  try {

    await plantValidation.validateAsync(req.body, { abortEarly: false });

    const species = await findOneSpecies(req.body.speciesId)
    const plant = await updatePlantWithPlantId(req.body);
    if(species && plant){
        res.status(200).json( {
            status: "success",
            plantInfo: API_HOSTNAME + "/api" + API_VERSION + "/plant/" + plant._id
        });
    }else{
        res.status(404).send({
            field: ["error"],
            message: ["Species not Found"]
        })
    }

  } catch (e) {
    return400or500Errors(e, res)
  }
    
};

export const addImageFromPlant = async (req: Request, res: Response, _: NextFunction) => {
    try {

        const file = req.file as Express.Multer.File
        const plantId = req.body.plantId;

        if (file) {
            const imagePlants = await newImage(file)
            const newImagePlant = await addImageWithPlantId(imagePlants, plantId)
            if (newImagePlant && imagePlants) {
                res.status(200).send({
                    "status": "success",
                    "plantInfo": API_HOSTNAME + "/api" + API_VERSION + "/plant/" + newImagePlant._id
                });
            }else{
                res.status(400).send({
                    field: ["error"],
                    message: ["PlantId is not Found."]
                })
            }
        } else {
            res.status(400).send({
                field: ["error"],
                message: ["The file attribute is not found"]
            });
        }
    } catch (e) {
        return400or500Errors(e, res)
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
export const removePlant = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const plant = await findOnePlant(req.params.plantId)
        if (plant) {
            for (const image of plant.images) {
                fs.unlinkSync("public/image/" + image.path);
                await deleteImage(image._id)
            }
            await deletePlantsWithPlantsId(new mongoose.Types.ObjectId(req.params.plantId.trim()))
            res.status(200).send({
                type: "success",
                message: "Plant deleted"
            })
        }
    } catch (e) {
        return400or500Errors(e, res)
    }
};
import {NextFunction, Request, Response} from "express";
import {
    findLimitedSpecies,
    findOneSpecies,
    createSpecies,
    updateSpecieWithSpeciesId,
    addImageWithSpeciesId,
    deleteImageWithSpeciesId,
    deleteSpeciesWithSpeciesId
} from "../queries/species.queries"
import {deleteImage, getImageById} from "../queries/image.queries";
import {newImage} from "./image.controller";
import mongoose from 'mongoose';
import * as fs from 'fs';
import {
    createSpeciesValidation, getSpeciesValidation,
    updateSpeciesValidation
} from "../database/validation/species.validation";
import {API_HOSTNAME, API_VERSION, return400or500Errors} from "../utils";

const limit: number = 5

export const getSpecies = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const search = (req.query.search) ? String(req.query.search) : ""
        const page = (req.query.page) ? Number(req.query.page) : Number(1)
        const order = (req.query.order == "ASC") ? 1 : -1
        const skip: number = limit * page - limit;

        await getSpeciesValidation.validateAsync(req.query, {abortEarly: false});

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
            return;
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

export const updateSpecies = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const speciesId = req.body.speciesId;

        await updateSpeciesValidation.validateAsync(req.body, {abortEarly: false});
        const updateSpecies = await updateSpecieWithSpeciesId(new mongoose.Types.ObjectId(speciesId.trim()), req.body);

        if (updateSpecies) {
            res.status(200).json({
                status: "success",
                path: API_HOSTNAME + "/api" + API_VERSION + "/species/" + speciesId
            })
        } else {
            res.status(404).send({
                field: ["error"],
                message: ["Species not Found."]
            })
        }

    } catch (e) {
        return400or500Errors(e, res)
    }

};


export const newSpecies = async (req: Request, res: Response, _: NextFunction) => {
    try {
        await createSpeciesValidation.validateAsync(req.body, {abortEarly: false});
        const species = await createSpecies(req.body);
        res.status(200).json({
            status: "success",
            path: API_HOSTNAME + "/api" + API_VERSION + "/species/" + species._id
        })
    } catch (e) {
        return400or500Errors(e, res)
    }
};


export const addImageFromSpecies = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const file = req.file as Express.Multer.File
        const speciesId = req.body.speciesId
        const species = await findOneSpecies(new mongoose.Types.ObjectId(speciesId.trim()))
        if (file) {
            if (species) {
                const imageSpecies = await newImage(file)
                await addImageWithSpeciesId(imageSpecies, new mongoose.Types.ObjectId(req.body.speciesId.trim()))
                res.status(200).send({
                    status: "success",
                    speciesInfo: API_HOSTNAME + "/api" + API_VERSION + "/species/" + req.body.speciesId.trim()
                });
            } else {
                res.status(400).send({
                    field: ["error"],
                    message: ["Species not Found"]
                })
            }
        } else {
            res.status(400).send({
                field: ["error"],
                message: ["Only image are allowed"]
            });
        }
    } catch (e) {
        return400or500Errors(e, res)
    }
};


//  add transaction for this one
export const removeImageFromSpecies = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const speciesId = req.params.speciedId
        const imageId = req.params.imageId
        const image = await getImageById(imageId)
        const species = await findOneSpecies(new mongoose.Types.ObjectId(speciesId.trim()))
        if (image && species) {
            await deleteImageWithSpeciesId(image._id, species._id)
            fs.unlinkSync("public/image/" + image.path);
            await deleteImage(imageId)
            res.status(200).send({
                type: "success",
                message: "File deleted"
            });
        } else {
            res.status(404).send({
                field: ["error"],
                message: ["Species or image not found"]
            });
        }


    } catch (e) {
        return400or500Errors(e, res)
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
            return;
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
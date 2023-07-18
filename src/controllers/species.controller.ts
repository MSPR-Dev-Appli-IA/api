import { NextFunction, Request, Response } from "express";
import {
    findLimitedSpecies,
    findOneSpecies,
    deleteSpeciesWithSpeciesId
} from "../queries/species.queries"


import mongoose from 'mongoose';

import {
    getSpeciesValidation,

} from "../database/validation/species.validation";
import { API_HOSTNAME, API_VERSION } from "../utils";

const limit: number = 5

export const getSpecies = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const search = (req.query.search) ? String(req.query.search) : ""
        const page = (req.query.page) ? Number(req.query.page) : Number(1)
        const order = (req.query.order == "ASC") ? 1 : -1
        const skip: number = limit * page - limit;

        await getSpeciesValidation.validateAsync(req.query, { abortEarly: false });

        const species = await findLimitedSpecies(limit, skip, order, search)
        const result: any[] = []

        species.forEach(item => {
            result.push({
                name: item.name,
                speciesInfo: API_HOSTNAME + "/api" + API_VERSION + "/species/" + item._id,
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





export const removeSpecies = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const speciesId = req.params.speciedId
        const species = await findOneSpecies(new mongoose.Types.ObjectId(speciesId.trim()))
        if (species) {
            await deleteSpeciesWithSpeciesId(new mongoose.Types.ObjectId(speciesId.trim()))
            res.status(204).send()

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
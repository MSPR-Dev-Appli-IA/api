import { Plant } from "../database/models/plant.models";
import { Image } from "../database/models/image.model"
import { User } from "../database/models/user.model";
import { Types } from 'mongoose';
import { Advice } from "../database/models/advice.model";
import { IAdvice } from "../interfaces/advice.interface";


export const getOneAdviceById = async (adviceId: Types.ObjectId): Promise<IAdvice | null> => {
    return await Advice.findOne({ _id: adviceId })
    .populate({ path: "plant", model: Plant })
    .populate({ path: "image", model: Image })
    .populate({ path: "taked_by", model: User}).exec();
};




export const findLimitedAdvicesNotTaken = async ( limit: number = 1, skip: number = 0, order: 1 | -1 = -1) => {
    return await Advice.find({
        taked_by: null,
    })
        .populate({ path: "plant", model: Plant })
        .populate({ path: "image", model: Image })
        .sort({ created_at: order }).skip(skip).limit(limit)
        .exec()
};
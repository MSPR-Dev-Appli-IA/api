import { PlantSitting } from "../database/models/plantSitting.model";
import { Plant } from "../database/models/plant.models";
import { Types } from 'mongoose';
import { IAddress, IPlantSitting } from "../interfaces";
import { Address } from "../database/models/adress.model";
import { Request} from "../database/models/request.model";



export const getOnePlantSittingById = async (plantSittingId: Types.ObjectId): Promise<IPlantSitting | null> => {
    return await PlantSitting.findOne({ _id: plantSittingId })
    .populate({ path: "plant", model: Plant })
    .populate({ path: "address", model: Address })
    .populate({ path: "requests", model: Request })
    .exec();
};

export const findPlantSittingsNotTakenAndNotBegin = async () => {
    const d =new Date();
    return await PlantSitting.find({
        start_at: {$gte: d.getTime()},
        is_taken: false

    })
    .populate({ path: "plant", model: Plant })
    .populate({ path: "address", model: Address })
    .exec()
};

export const findOnePlantSitting = async (plantSittingId: Types.ObjectId) => {
    return PlantSitting.findOne({ _id: plantSittingId })
    .populate({ path: "plant", model: Plant })
    .populate({ path: "address", model: Address })
    .exec()
};

export const findOnePlantSittinWithRequest = async (plantSittingId: Types.ObjectId) => {
  return PlantSitting.findOne({ _id: plantSittingId })
  .populate({ path: "plant", model: Plant })
  .populate({ path: "address", model: Address })
  .exec()
};

export const setTakenPlantSittingTrue = async (plantSittingId: Types.ObjectId) => {

  return await PlantSitting.findByIdAndUpdate(plantSittingId, {
    $set: {
      is_taken:true
    },
  },
    { new: true })

};




export const createPlantSitting = async (title:string,description:string,start_at:Date,end_at:Date,address:IAddress) => {
    const newPlantSitting = new PlantSitting({
      title:title,
      description:description,
      start_at:start_at,
      end_at:end_at,
      address:address,
      requests: []
    });
    return await newPlantSitting.save();
  
  };
  

  export const updatePlantSittingWithPlantSittingsId = async (plantSittingId: Types.ObjectId,title:string,description:string,start_at:Date,end_at:Date,address:IAddress) => {
    return await PlantSitting.findByIdAndUpdate(plantSittingId, {
        title:title,
        description:description,
        start_at:start_at,
        end_at:end_at,
        address:address
    },
      { new: true })
  };
  

export const deletePlantSittingWithPlantSittingId = async (plantSittingId: Types.ObjectId) => {
    await PlantSitting.findOneAndDelete(plantSittingId).exec();
  }
  

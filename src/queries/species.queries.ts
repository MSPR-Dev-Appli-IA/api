const Species = require("../database/models/species.model")
import { PipelineStage } from "mongoose";


export const findLimitedSpecies = async (limit:Number=1,skip:Number=0, order:1|-1=-1, search:String|null ) => {
     const  aggregateArray:PipelineStage[] = [
    {
      $lookup: {
        from: "image",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },
    { $sort: { name: order } },
  ];
  if (search) {
      aggregateArray.push({ $match: { name: { $regex: search } } });
  }
    return Species.aggregate(aggregateArray).skip(skip).limit(limit);
  };
  
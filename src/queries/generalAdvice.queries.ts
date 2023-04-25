import { GeneralAdvice } from "../database/models/generalAdvice.model";
import { GeneralAdviceForm } from "../interfaces";


export const createGeneralAdvice= async (generalAdvice :GeneralAdviceForm) => {
    try {
      const newGeneralAdvice  = new GeneralAdvice({
        description: generalAdvice.description
      });
      return await newGeneralAdvice.save();
    } catch (e) {
      throw e;
    }
  };
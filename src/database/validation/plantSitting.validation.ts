// title: { type: String, required: true },
//     description: { type: String, required: true },
//     created_at : { type: Date, default: Date.now },
//     start_at : { type: Date, required: true },
//     end_at : { type: Date, required: true},
//     is_taken: { type: Boolean, required: true,default: false},
//     address: { type: schema.Types.ObjectId, ref: "Address", required: true },
//     plant: { type: schema.Types.ObjectId, ref: "Plant", required: true },


import  Joi from "joi";




const plantSittingValidation = Joi.object({

  title: Joi.string().min(2).required().messages({
    "string.base": "Le  titre  n'est pas valide",
  }),
  description: Joi.string().min(2).required().messages({
    "string.base": "La description valide",

  }),
  start_at: Joi.date().min(Date.now()).required().messages({
    "string.base": "La date de de debut n'est pas valide",

  }),
  end_at: Joi.date().min(Joi.ref('start_at')).required().messages({
    "string.base": "La datez  de fin n'est pas valide",
  }),
  address: Joi.string().min(2).required().messages({
    "string.base": "L'addresse de fin n'est pas valide",
  }),



});


export  {
    plantSittingValidation
  };
  
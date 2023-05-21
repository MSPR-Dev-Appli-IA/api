import  Joi from "joi";




const plantValidation = Joi.object({
  plantId: Joi.string().length(24).required(),
  name: Joi.string().min(2).required().messages({
    "string.base": "Le nom de plante  n'est pas valide",
    "string.empty": "Vous n' avez pas de nom pour votre plante  ",
    "string.min": " Votre nom de plante  est trop courte",
  }),
  speciesId: Joi.string().length(24).required()
});

const getMyPlantsValidation = Joi.object({
  speciesId: Joi.string().length(24),
  search: Joi.string().min(2),
  page: Joi.number().positive(),
  order: Joi.string().min(3).valid("ASC", "DESC")
})


export  {
    plantValidation, getMyPlantsValidation
  };
  
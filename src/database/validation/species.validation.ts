import  Joi from "joi";




const speciesValidation = Joi.object({

  name: Joi.string().min(2).required().messages({
    "string.base": "Le  nom de m'espece  n'est pas valide",
    "string.empty": "Vous n' avez pas de nom pour votre espece  ",
    "string.min": " Votre nom d'espece est trop courte",
  }),

  description: Joi.string().min(5).messages({
    "string.min": "Le champs description au soleil est invalide  ",
}),
  sunExposure: Joi.string().min(2).messages({
    "string.min": "Le champs exposition au soleil est invalide  ",

  }),
  watering: Joi.string().min(2).messages({
    "string.min": "Le champs arrosage   n'est pas valide",
  }),
  optimalTemperature: Joi.string().min(2).messages({
    "string.min": "Le champs temperature optimal n'est pas valide",
  }),


});


export  {
    speciesValidation
  };
  
import  Joi from "joi";

const createSpeciesValidation = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.base": "Le  nom de m'espece  n'est pas valide",
    "string.empty": "Vous n' avez pas de nom pour votre espece",
    "string.min": " Votre nom d'espece est trop courte",
  }),

  description: Joi.string().min(5).messages({
    "string.min": "Le champs description au soleil est trop court",
  }),
  sunExposure: Joi.string().min(2).messages({
    "string.min": "Le champs exposition au soleil est trop court",

  }),
  watering: Joi.string().min(2).messages({
    "string.min": "Le champs arrosage est trop court",
  }),
  optimalTemperature: Joi.string().min(2).messages({
    "string.min": "Le champs temperature optimal est trop court",
  }),
});

const updateSpeciesValidation = Joi.object({
  speciesId: Joi.string().length(24).required().messages({
    "string.min": "Le numéro d'espèce recherché est invalide",
  }),

  name: Joi.string().min(2).required().messages({
    "string.base": "Le  nom de m'espece  n'est pas valide",
    "string.empty": "Vous n' avez pas de nom pour votre espece",
    "string.min": " Votre nom d'espece est trop courte",
  }),

  description: Joi.string().min(5).messages({
    "string.min": "Le champs description au soleil est trop court",
}),
  sunExposure: Joi.string().min(2).messages({
    "string.min": "Le champs exposition au soleil est trop court",

  }),
  watering: Joi.string().min(2).messages({
    "string.min": "Le champs arrosage est trop court",
  }),
  optimalTemperature: Joi.string().min(2).messages({
    "string.min": "Le champs temperature optimal est trop court",
  }),
});


export  {createSpeciesValidation, updateSpeciesValidation};
  
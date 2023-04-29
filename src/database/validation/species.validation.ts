import  Joi from "joi";




const speciesValidation = Joi.object({

  name: Joi.string().min(1).required().messages({
    "string.base": "Le  nom de m'espece  n'est pas valide",
    "string.empty": "Vous n' avez pas de nom pour votre espece  ",
    "sting.min": " Votre nom d'espece est trop courte",
  }),


});


export  {
    speciesValidation
  };
  
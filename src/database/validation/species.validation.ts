import  Joi from "joi";


const generalAdviceSchema = {
  description: Joi.string().min(15).messages({
    "string.base": "La description  n'est pas valide",
    "string.empty": "Vous n' avez pas de description  ",
    "sting.min": " Votre description est trop courte",
  }),
};

const speciesValidation = Joi.object({

  name: Joi.string().min(1).required().messages({
    "string.base": "Le  nom de m'espece  n'est pas valide",
    "string.empty": "Vous n' avez pas de nom pour votre espece  ",
    "sting.min": " Votre nom d'espece est trop courte",
  }),
  generalAdvices:Joi.array().items(Joi.object(generalAdviceSchema)).required()

});


export  {
    speciesValidation
  };
  
import  Joi from "joi";




const plantValidation = Joi.object({

  name: Joi.string().min(2).required().messages({
    "string.base": "Le  nom de plante  n'est pas valide",
    "string.empty": "Vous n' avez pas de nom pour votre plante  ",
    "string.min": " Votre nom de plante  est trop courte",
  }),


});


export  {
    plantValidation
  };
  
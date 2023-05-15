import  Joi from "joi";

const userInfoValidation = Joi.object({
  username: Joi.string().min(1).required().messages({
    "string.base": "Le  username n'est pas valide",
    "string.empty": "Vous n' avez pas de username ",
    "sting.min": "Votre username est trop court",
  }),
  firstname: Joi.string().min(1).required().messages({
    "string.base": "Le  prenom n'est pas valide",
    "string.empty": "Vous n' avez pas de prenom ",
    "sting.min": "Votre prenom est trop court",
  }),
  lastname: Joi.string().min(1).required().messages({
    "string.base": "Le  nom n'est pas valide",
    "string.empty": "Vous n' avez pas de nom ",
    "sting.min": "Votre nom est trop court",
  }),
});


const userPasswordValidation = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.base": "Veuillez renseignez un mot de passe",
      "string.pattern.base":
        "Le mot de passe doit  être au minimum de 6 caractères",
    }),
});

const userSignupValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Veuillez renseignez un email valide",
    "string.empty": "Veuillez renseignez un email valide",

    "string.email": "Veuillez renseignez un email valide",
  }),
  username: Joi.string().min(1).required().messages({
    "string.base": "Le  usernom n'est pas valide",
    "string.empty": "Vous n' avez pas de username",
    "string.min": "Votre username est trop court",
  }),
  firstname: Joi.string().min(1).required().messages({
    "string.base": "Le  prenom n'est pas valide",
    "string.empty": "Vous n'avez pas de prenom ",
    "string.min": "Votre prenom est trop court",
  }),
  lastname: Joi.string().min(1).required().messages({
    "string.base": "Le  nom n'est pas valide",
    "string.empty": "Vous n' avez pas de nom ",
    "string.min": "Votre nom est trop court",
  }),
 
  password: Joi.string()
  .min(6)
    .required()
    .messages({
      "string.base": "Veuillez renseignez un mot de passe",
      "string.min":  "Le mot de passe doit être au minimum de 6 caractères",
    }),
});

export  {
  userInfoValidation,
  userPasswordValidation,
  userSignupValidation,
};

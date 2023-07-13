import  Joi from "joi";
export const plantSittingValidation = Joi.object({
  plantId: Joi.string().length(24).required(),
  description: Joi.string().min(2).required().messages({
    "string.base": "La description valide",

  }),
  start_at: Joi.date().min(Date.now()).required().messages({
    "string.base": "La date de de debut n'est pas valide",

  }),
  end_at: Joi.date().min(Joi.ref('start_at')).required().messages({
    "string.base": "La datez  de fin n'est pas valide",
  }),
  address: Joi.object({
    district: Joi.string().min(3).required(),
    location: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    })
  })
});

export const updateplantSittingValidation = Joi.object({
  plantSittingId: Joi.string().length(24).required(),
  plantId: Joi.string().length(24).required(),
  description: Joi.string().min(2).required().messages({
    "string.base": "La description valide",

  }),
  start_at: Joi.date().min(Date.now()).required().messages({
    "string.base": "La date de de debut n'est pas valide",

  }),
  end_at: Joi.date().min(Joi.ref('start_at')).required().messages({
    "string.base": "La datez  de fin n'est pas valide",
  }),
  address: Joi.object({
    district: Joi.string().min(3).required(),
    location: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    })
  })
});
  
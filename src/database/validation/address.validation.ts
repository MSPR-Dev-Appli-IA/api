import  Joi from "joi";

export const addressValidation = Joi.object({
    label: Joi.string().min(2).required().messages({
        "string.base": "L'addresse de fin n'est pas valide",
    }),
    countryCode: Joi.string().max(2).required()
})
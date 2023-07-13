import Joi from "joi";

export const createRequestValidation = Joi.object({
    plantSittingId: Joi.string().length(24).required(),
});
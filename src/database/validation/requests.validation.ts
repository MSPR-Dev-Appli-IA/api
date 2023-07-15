import Joi from "joi";

export const createRequestValidation = Joi.object({
    plantSittingId: Joi.string().length(24).required(),
});

export const defaultRequestValidation = Joi.object({
    requestId: Joi.string().length(24).required(),
});
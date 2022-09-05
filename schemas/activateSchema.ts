import Joi from "joi";

const activateCardSchema = Joi.object({
  securityCode: Joi.string().required(),
  password: Joi.string().required(),
});

export default activateCardSchema;
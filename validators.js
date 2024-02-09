const Joi = require("joi");
const validate = (schema) => (payload) => schema.validate(payload);


const feedbackSchema = Joi.object({
    rating: Joi.number().required(),
    text: Joi.string().min(5).required(),
    tags: Joi.string(),
    isPublished: Joi.boolean()
});


module.exports.validateFeedback = validate(feedbackSchema);
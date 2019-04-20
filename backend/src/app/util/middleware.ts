const Joi = require('joi');

export function validateTable(state) {
    const schema = Joi.object().keys({
        nickname: Joi.string().alphanum().max(255).required(),
        subject: [Joi.string().optional(), Joi.allow(null)],
        subjectDescription: [Joi.string().optional(), Joi.allow(null)],
        briefMessage: [Joi.string().optional(), Joi.allow(null)],
    });

    const result = Joi.validate(state.data, schema);

    if (result.error) {
        throw new Error('Bad validation');
    }
}

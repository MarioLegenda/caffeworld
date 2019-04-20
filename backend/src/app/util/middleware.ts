const Joi = require('joi');

export function validateTable(state) {
    const schema = Joi.object().keys({
        nickname: Joi.string().alphanum().max(255).required(),
    });

    const result = Joi.validate(state.data, schema);

    if (result.error) {
        throw new Error('Bad validation');
    }
}

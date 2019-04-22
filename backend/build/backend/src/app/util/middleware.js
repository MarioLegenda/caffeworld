"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
function validateTable(state) {
    const schema = Joi.object().keys({
        nickname: Joi.string().alphanum().max(255).required(),
    });
    const result = Joi.validate(state.data, schema);
    if (result.error) {
        throw new Error('Bad validation');
    }
}
exports.validateTable = validateTable;
function createCreateTableModel(state) {
    return state.data;
}
exports.createCreateTableModel = createCreateTableModel;

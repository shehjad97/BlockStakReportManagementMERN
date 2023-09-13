const Joi = require('joi');
const { validate } = require("../utils/validate");

const register = {
    body: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).message("Password must be at least 8 characters long").required(),
        confirmPassword: Joi.string().required(),
        profession: Joi.string().required(),
        favoriteColors: Joi.array().items(Joi.string().required()).required(),
    })
};

const login = {
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
};

const makeAdminValidation = {
    body: Joi.object({
        userId: Joi.string().required(),
    })
};

module.exports = {
    registerValidation: validate(register),
    loginValidation: validate(login),
    makeAdminValidation: validate(makeAdminValidation),
}
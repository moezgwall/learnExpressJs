const Joi = require('joi');
const { VALIDATION_LIMITS } = require('../constants/constants');

// User registration validation schema
const registerSchema = Joi.object({
  name: Joi.string()
    .min(VALIDATION_LIMITS.MIN_NAME_LENGTH)
    .max(VALIDATION_LIMITS.MAX_NAME_LENGTH)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
    }),
  email: Joi.string()
    .email()
    .max(VALIDATION_LIMITS.MAX_EMAIL_LENGTH)
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
    }),
  password: Joi.string()
    .min(VALIDATION_LIMITS.MIN_PASSWORD_LENGTH)
    .max(VALIDATION_LIMITS.MAX_PASSWORD_LENGTH)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    }),
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
    }),
  password: Joi.string()
    .min(VALIDATION_LIMITS.MIN_PASSWORD_LENGTH)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    }),
});

// User update validation schema
const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(VALIDATION_LIMITS.MIN_NAME_LENGTH)
    .max(VALIDATION_LIMITS.MAX_NAME_LENGTH)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
    }),
  email: Joi.string()
    .email()
    .max(VALIDATION_LIMITS.MAX_EMAIL_LENGTH)
    .optional()
    .messages({
      'string.email': 'Invalid email format',
    }),
  password: Joi.string()
    .min(VALIDATION_LIMITS.MIN_PASSWORD_LENGTH)
    .max(VALIDATION_LIMITS.MAX_PASSWORD_LENGTH)
    .optional()
    .messages({
      'string.min': 'Password must be at least 6 characters',
    }),
}).min(1);

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};

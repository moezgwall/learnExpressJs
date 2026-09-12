const { registerSchema, loginSchema, updateUserSchema } = require('../validation/schemas');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants/constants');

const validateRegister = (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(err => err.message);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    req.body = value;
    next();
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

const validateLogin = (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(err => err.message);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    req.body = value;
    next();
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

const validateUpdateUser = (req, res, next) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(err => err.message);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    req.body = value;
    next();
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateUser,
};

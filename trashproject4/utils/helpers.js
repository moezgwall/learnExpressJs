const bcrypt = require('bcryptjs');

// Hash password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error('Error hashing password');
  }
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    throw new Error('Error comparing password');
  }
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>"']/g, '');
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Generate error response
const generateErrorResponse = (message, status = 500) => {
  return {
    success: false,
    message,
    status,
  };
};

// Generate success response
const generateSuccessResponse = (data, message = 'Success', status = 200) => {
  return {
    success: true,
    message,
    data,
    status,
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  sanitizeInput,
  isValidEmail,
  generateErrorResponse,
  generateSuccessResponse,
};

const { body } = require('express-validator');

const validateloginUser = [
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
  body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string')
];

const validateregisterUser = [
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
  body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string')
];

module.exports = {
  validateloginUser,
  validateregisterUser
};

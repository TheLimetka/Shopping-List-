const { body, query, validationResult } = require('express-validator');

const validateCreateShoppingList = [
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
  body('member_ids').optional().isArray().withMessage('Member IDs must be an array'),
  body('archived').optional().isBoolean().withMessage('Archived must be a boolean'),
];

const validateUpdateShoppingList = [
  body('name').optional().isString(),
  body('owner_id').optional().isString(),
  body('member_ids').optional().isArray(),
  body('member_ids.*').optional().isString(),
  body('isArchived').optional().isBoolean(),
  body('items').optional().isArray(),
  body('items.*.item_id').optional().isString().withMessage('Item ID must be a string'),
  body('items.*.item_name').notEmpty().isString().withMessage('Item name is required and must be a string'),
  body('items.*.is_solved').optional().isBoolean().withMessage('is_solved must be a boolean'),
  body('items.*.created_at').optional().isISO8601().withMessage('created_at must be a valid ISO date')
];

const validateCreateItem = [
  body('item_name').notEmpty().withMessage('Item name is required').isString().withMessage('Item name must be a string'),
  body('quantity').optional().isNumeric().withMessage('Quantity must be a number')
];

const validateUpdateItem = [
  body('item_name').optional().isString().withMessage('Item name must be a string'),
  body('is_solved').optional().isBoolean().withMessage('is_solved must be a boolean'),
  body('quantity').optional().isNumeric().withMessage('Quantity must be a number')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCreateShoppingList,
  validateUpdateShoppingList,
  validateCreateItem,
  validateUpdateItem,
  validate,
};
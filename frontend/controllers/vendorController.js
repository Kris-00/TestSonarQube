const {
    body,
    validationResult
} = require('express-validator');

//validates body
exports.validateProduct = [
    body('product_name').isLength({min:1}).withMessage('Name is required')
    .trim()
    .escape(),
    body('category').isLength({min:1}).withMessage('Category is required')
    .trim()
    .escape(),
    body('product_price').isLength({min:1}).withMessage('Price is required')
    .trim()
    .escape(),
    body('product_stock').isLength({min:1}).withMessage('Stock is required')
    .trim()
    .escape(),
]
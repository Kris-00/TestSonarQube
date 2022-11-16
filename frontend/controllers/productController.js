const {
    body,
    validationResult
} = require('express-validator');

exports.validateCreateProducts = () => {
    return [
        body('productName').exists()
        .withMessage('Product Name is required')
        .trim()
        .escape()
        ,
        body('category').exists()
        .withMessage('Category is required')
        .trim()
        .escape()
        ,
        body('product_price').exists()
        .withMessage('Product Price is required')
        .trim()
        .escape()
        .isNumeric()
        .withMessage('Product Price must be numeric')
        ,
        body('stock').exists()
        .withMessage('Stock is required')
        .trim()
        .escape()
        .isNumeric()
        .withMessage('Stock must be numeric')
        ,
    ]
}

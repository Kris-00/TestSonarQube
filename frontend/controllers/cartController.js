const {
    body,
    validationResult
} = require('express-validator');

//validates the quantity of the product passed
exports.validateIdQuantity = () => {
    return [
        body('quantity').exists()
        .withMessage('quantity is required')
        .trim()
        .escape()
        .isNumeric()
        .withMessage('quantity must be numeric')
        .custom(value => {
            if (value <= 0) {
                throw new Error('quantity must be greater than 0');
            }
            return true;
        }),
        body('product_id').exists()
        .withMessage('product id is required')
        .trim()
        .escape()
            
    ]
}
exports.validateId = () => {
    return [
        body('product_id').exists()
        .withMessage('product id is required')
        .trim()
        .escape()
            
    ]
}
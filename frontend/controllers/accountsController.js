const {
    body,
    validationResult
} = require('express-validator');



// validates and the input from the user for the login page
exports.validateLoginInput = () => {
    return [
        body('email').exists()
        .withMessage('email is required')
        .trim()
        .isEmail()
        .withMessage('email is invalid')
        .normalizeEmail()
        .escape(),
        body('password').exists()
        .withMessage('password is required')
        
    ]
}
exports.validateRegisterInput = () => {
    return [
        body('firstName')
        .exists()
        .withMessage('first name is required')
        .trim()
        .escape()
        .isAlpha()
        .withMessage('first name must be alphabetic')
        ,
        body('lastName')
        .exists()
        .withMessage('last name is required')
        .trim()
        .escape()
        .isAlpha()
        .withMessage('last name must be alphabetic')
        ,
        body('email').exists()
        .withMessage('email is required')
        .trim()
        .escape()
        .isEmail()
        .withMessage('email is invalid')
        .normalizeEmail(),
        
        body('password').exists()
        .withMessage('password is required')
        .custom(value => {
            if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,64}$/)) {
                throw new Error('password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            }
            return true;
        }),
        body('dob').exists()
        .withMessage('date of birth is required')
        .trim()
        .escape()
        .isDate()
        .withMessage('date of birth must be a valid date')
        .custom(value => {
            var today = new Date();
            var birthDate = new Date(value);
            if (birthDate > today) {
                throw new Error('date of birth must be in the past');
            }
            return true;
        })

        
    ]
}

exports.validateEmail = () => {
    return [
        body('email').exists()
        .withMessage('email is required')
        .trim()
        .escape()
        .isEmail()
        .withMessage('email is invalid')
        .normalizeEmail()
    ]
}
exports.ValidateEmailPassworrdCode = () => {
    return [
        body('email').exists()
        .withMessage('email is required')
        .trim()
        .escape()
        .isEmail()
        .withMessage('email is invalid')
        .normalizeEmail(),
        body('password').exists()
        .withMessage('password is required')
        .custom(value => {
            if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,64}$/)) {
                throw new Error('password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            }
            return true;
        }),
        body('verification').exists()
        .withMessage('code is required')
        .trim()
        .escape()        
    ]
}
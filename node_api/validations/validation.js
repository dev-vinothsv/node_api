const { check } = require('express-validator');
exports.signupValidation = [
    check('first_name', 'First Name is requied').not().isEmpty(),
    check('last_name', 'Last Name is requied').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
exports.loginValidation = [
     check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers');

const { isAuthenticated } = require('../middleware/authenticate');

const {body, validationResult } = require("express-validator");

const validateCustomers = [
    body("name").isString().isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters."),
    body("age").isNumeric().isFloat({ min: 0 }).withMessage("age must be a positive number."),
    body("email").isEmail().withMessage("Invalid email format."),
    body("address").isString().isLength({ min: 5, max: 100 }).withMessage("Address must be between 5 and 100 characters."),
    body("phone").isString().matches(/^\d{10,15}$/).withMessage("Phone number must be a 10-digit number."),
    body("occupation").isString().isLength({ min: 2, max: 100 }).withMessage("Occupation must be between 2 and 100 characters."),    
    body("itemBought").isString().notEmpty().withMessage("The item bought is required."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Define API routes
router.get('/', customersController.getAll);
router.get('/:id', customersController.getSingle);
router.post('/', isAuthenticated, validateCustomers, customersController.createCustomer);
router.put('/:id', isAuthenticated, validateCustomers, customersController.updateCustomer);
router.delete('/:id', isAuthenticated, customersController.deleteCustomer);

module.exports = router;
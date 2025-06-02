const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

const { isAuthenticated } = require('../middleware/authenticate');

const {body, validationResult } = require("express-validator");

const validateItem = [
    body("name").isString().isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters."),
    body("description").isString().isLength({ min: 10, max: 255 }).withMessage("Description must be between 10 and 255 characters."),
    body("price").isNumeric().isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("category").isString().notEmpty().withMessage("Category is required."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Define API routes
router.get('/', itemsController.getAll);
router.get('/:id', itemsController.getSingle);
router.post('/', isAuthenticated, validateItem, itemsController.createItem);
router.put('/:id', isAuthenticated, validateItem, itemsController.updateItem);
router.delete('/:id', isAuthenticated, itemsController.deleteItem);

module.exports = router;
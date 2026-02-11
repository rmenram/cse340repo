const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {}

/* ******************************
 * Inventory Rules
 * ***************************** */
validate.addInventoryRules = () => {
    return [
        body("classification_id").trim().escape().notEmpty().withMessage("Please select a classification."),
        body("inv_make").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Please provide a make."),
        body("inv_model").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Please provide a model."),
        body("inv_year").trim().escape().notEmpty().isLength({ min: 4, max: 4 }).isNumeric().withMessage("Please provide a 4-digit year."),
        body("inv_price").trim().escape().notEmpty().isNumeric().withMessage("Price must be a number."),
        body("inv_miles").trim().escape().notEmpty().isNumeric().withMessage("Miles must be a number."),
        body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),
    ]
}

/* ******************************
 * Check data and return errors or continue to controller
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationSelect = await utilities.buildClassificationList(classification_id);
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationSelect,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors to edit view or continue to controller
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationSelect = await utilities.buildClassificationList(classification_id);
        res.render("inventory/edit-inventory", {
            errors,
            // title: "Edit Vehicle",
            title: req.title,
            nav,
            classificationSelect,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            inv_id,
        })
        return
    }
    next()
}

module.exports = validate

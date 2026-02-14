const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ******************************
 * Classification Rules
 * ***************************** */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric()
            .withMessage("Name cannot contain spaces or special characters.")
            .custom(async (classification_name) => {
                const check = await invModel.checkExistingClassification(classification_name);
                if (check) throw new Error("Classification exists. Please use a different name.");
            }),
    ]
}

/* ******************************
 * Check data and return errors or continue to controller
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav, 
            classification_name,
        })
        return
    }
    next()
}

/*********************************
W06 Assignment: Final Enhancement
*********************************/
/* ******************************
 * Check data and return errors or continue to controller
 * ***************************** */
validate.checkClassificationUpdateData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/edit-classification", {
            errors,
            title: "Edit Classification",
            nav, 
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate

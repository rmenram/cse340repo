// Needed Resources 
const invValidate = require("../utilities/inventory-validation")
const classValidate = require('../utilities/classification-validation')
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:inv_id", invController.buildByInvId);

// Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to add new classification view
router.get("/add-classification", invController.buildAddClassification);

// Process the new classification
router.post(
  "/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to add new vehicle view
router.get("/add-inventory", invController.buildAddInventory)

// Process the new vehicle
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;
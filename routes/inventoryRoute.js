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
router.get("/", utilities.checkPrivileges, utilities.handleErrors(invController.buildManagementView));

// Route to add new classification view
router.get("/add-classification", utilities.checkPrivileges, invController.buildAddClassification);

// Process the new classification
router.post(
  "/add-classification",
  utilities.checkPrivileges, 
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to add new vehicle view
router.get("/add-inventory", utilities.checkPrivileges, invController.buildAddInventory)

// Process the new vehicle
router.post(
  "/add-inventory",
  utilities.checkPrivileges, 
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build inventory edit view
router.get("/edit/:inv_id", utilities.checkPrivileges, utilities.handleErrors(invController.buildEditByInvId));
// Process the update
// router.post("/update/", utilities.handleErrors(invController.updateInventory))
router.post(
  "/update",
  utilities.checkPrivileges, 
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build inventory delete view
router.get("/delete/:inv_id", utilities.checkPrivileges, utilities.handleErrors(invController.buildDeleteByInvId));
// Process delete
// router.post(
//   "/delete",
//   invValidate.addInventoryRules(),
//   invValidate.checkUpdateData,
//   utilities.handleErrors(invController.deleteInventory)
// )
router.post("/delete", utilities.checkPrivileges, utilities.handleErrors(invController.deleteInventory))

/*********************************
W06 Assignment: Final Enhancement
*********************************/
// Route to build classification management view
router.get("/manage-classifications", utilities.checkPrivileges, utilities.handleErrors(invController.buildClassificationMgmtView));
// Route to build classification edit view
router.get("/edit-classification/:classification_id", utilities.checkPrivileges, utilities.handleErrors(invController.buildEditClassification));
// Process the classification update
router.post(
  "/edit-classification",
  utilities.checkPrivileges, 
  classValidate.classificationRules(),
  classValidate.checkClassificationUpdateData,
  utilities.handleErrors(invController.updateClassification)
)

module.exports = router;
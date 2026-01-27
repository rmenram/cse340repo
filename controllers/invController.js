const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  // const className = data[0].classification_name
  const className = (data.length > 0) ? data[0].classification_name : "No";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view aka vehicle
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getVehicleByInventoryId(inv_id)
  const grid = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  // const vehicleYearMakeModel = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  const vehicleYearMakeModel = (data.length > 0) ? data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model : "No Vehicle";
  res.render("./inventory/classification", {
    title: vehicleYearMakeModel,
    nav,
    grid,
  })
}

module.exports = invCont
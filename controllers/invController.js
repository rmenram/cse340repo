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

/* ***************************
 *  Deliver inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect,
    })
}

/* ***************************
 *  Deliver Add Classification view
 * ************************** */
invCont.buildAddClassification = (req, res) => {
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav: req.nav,
        errors: null,
    })
}

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addClassification = async (req, res) => {
    const { classification_name } = req.body;
    const regResult = await invModel.addClassification(classification_name);

    if (regResult) {
        // Regenerate navigation menu (Dynamic update)
        const nav = await utilities.getNav(); 
        
        req.flash("success", `The ${classification_name} classification was added successfully.`);
        // Render management view with updated nav
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, adding classification failed.");
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav: req.nav,
            errors: null,
        });
    }
};

/* ***************************
 *  Deliver Add Vehicle view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
    let classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav: req.nav,
        classificationSelect,
        errors: null,
    })
}

/* ****************************************
*  Process Add Vehicle
* *************************************** */
invCont.addInventory = async (req, res) => {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList();
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    } = req.body;

    const regResult = await invModel.addVehicle(
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    );

    if (regResult) {
      // Regenerate navigation menu (Dynamic update)
      // const nav = await utilities.getNav(); 
      
      req.flash("success", `The ${inv_make} ${inv_model} vehicle was successfully added.`);
      // Render management view with updated nav
      res.render("inventory/management", {
          title: "Vehicle Management",
          nav,
          classificationSelect,
          // errors: null,
      });
    } else {
        req.flash("notice", "Sorry, adding vehicle failed.");
        res.status(501).render("inventory/add-classification", {
            title: "Add Vehicle",
            nav: req.nav,
            classificationSelect,
            // errors: null,
            // inv_make,
            // inv_model,
            // inv_year,
            // inv_description,
            // inv_image,
            // inv_thumbnail,
            // inv_price,
            // inv_miles,
            // inv_color,
        });
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Deliver Edit Vehicle view
 * ************************** */
invCont.buildEditByInvId = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getVehicleByInventoryId(inv_id)
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(data[0].classification_id)
    const itemName = (data.length > 0) ? data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model : "No Vehicle";
    res.render("./inventory/edit-inventory", {
    title: itemName,
    nav,
    errors: null,
    classificationSelect,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_description: data[0].inv_description,
    inv_image: data[0].inv_image,
    inv_thumbnail: data[0].inv_thumbnail,
    inv_price: data[0].inv_price,
    inv_miles: data[0].inv_miles,
    inv_color: data[0].inv_color,
    classification_id: data[0].classification_id,
  })
}

/* ****************************************
*  Process Update Vehicle
* *************************************** */
invCont.updateInventory = async (req, res) => {
    let nav = await utilities.getNav();
    // let classificationSelect = await utilities.buildClassificationList();
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;

    const regResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    );

    if (regResult) {
        req.flash("success", `The ${inv_make} ${inv_model} vehicle was successfully updated.`);
    //   res.render("inventory/management", {
    //       title: "Vehicle Management",
    //       nav,
    //       classificationSelect,
    //       // errors: null,
    //   });
        res.redirect("/inv/")        
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the update failed.");
        res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
        });
    }
};

/* ***************************
 *  Deliver Delete Vehicle Confirmation view
 * ************************** */
invCont.buildDeleteByInvId = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getVehicleByInventoryId(inv_id)
    let nav = await utilities.getNav()
    const itemName = (data.length > 0) ? data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model : "No Vehicle";
    res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_price: data[0].inv_price,
  })
}

/* ****************************************
*  Process Delete Vehicle
* *************************************** */
invCont.deleteInventory = async (req, res) => {
    let nav = await utilities.getNav()
    // const { inv_id, } = req.body;    
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
        // req.flash("success", `The ${inv_make} ${inv_model} vehicle was successfully deleted.`)
        req.flash("success", `The vehicle was successfully deleted.`)
        res.redirect("/inv/") 
    } else {
        // const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the delete failed.")
        // res.status(501).render("inventory/delete-confirm", {
        // title: "Delete " + itemName,
        // nav,
        // errors: null,
        // inv_id,
        // inv_make,
        // inv_model,
        // inv_year,
        // inv_price,
        // })
        res.redirect("/inv/delete/" + inv_id)
    }
};

/*********************************
W06 Assignment: Final Enhancement
*********************************/
/* ***************************
 *  Deliver classification management view
 * ************************** */
invCont.buildClassificationMgmtView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let list = await utilities.buildEditClassificationList()
    res.render("./inventory/manage-classifications", {
        title: "Classification Management",
        nav,
        errors: null,
        list,
    })
}

/* ***************************
 *  Deliver Edit Classification view
 * ************************** */
invCont.buildEditClassification = async function (req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    const data = await invModel.getClassificationById(classification_id)
    let nav = await utilities.getNav()
    if (!data.length > 0) {
        req.flash("notice", "Classification Not Found")
        return res.redirect("/inv/manage-classifications")
    }
    res.render("./inventory/edit-classification", {
    title: data[0].classification_name,
    nav,
    errors: null,
    classification_name: data[0].classification_name,
    classification_id: data[0].classification_id,
  })
}

/* ****************************************
*  Process Update Classification X
* *************************************** */
invCont.updateClassificationX = async (req, res) => {
    let nav = await utilities.getNav();
    const {classification_name,classification_id,} = req.body;
    const regResult = await invModel.updateClassification(classification_id,classification_name,)
    if (regResult) {
        req.flash("success", `The Classification was successfully updated.`);
        res.redirect("/inv/manage-classifications")        
    } else {
        req.flash("notice", "Sorry, the update failed.")
        return res.redirect("/inv/manage-classifications")
    }
};

/* ****************************************
*  Process Update Classification
* *************************************** */
invCont.updateClassification = async (req, res) => {
    const {classification_id,classification_name} = req.body;
    const regResult = await invModel.updateClassification(classification_id,classification_name);
    if (regResult) {
        //Reflect the updated classification name in both the navigation bar and in the classification list
        let nav = await utilities.getNav()
        let list = await utilities.buildEditClassificationList()
        req.flash("success", `The classification name was succesfully updated to ${classification_name}.`);
        res.render("inventory/manage-classifications", {
            title: "Classification Management",
            nav,
            errors: null,
            list,
        });
    } else {
        const itemName = classification_name
        req.flash("notice", "Sorry, the update failed.");
        res.status(501).render("inventory/edit-classification", {
        title: "Edit " + itemName,
        nav: req.nav,//no need to reflect the latest and greatest navigation since the update failed
        errors: null,
        classification_name,
        classification_id,
        });
    }
};

module.exports = invCont
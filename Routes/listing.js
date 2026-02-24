const express = require("express");
const { storage } = require("../cloudConfig.js");
const multer = require('multer')
const upload = multer({ storage })
const router = express.Router({ mergeParams: true });
const listingSchema = require("../Validations/schemaValidation.js")
const wrapAsync = require("../wrapAsync");
const passport = require("passport");
const isLogged = require("../middlewares.js");
const postlogin = require("../postloginmiddleware.js");
const ExpressError = require("../ExpressError.js");
const listingController = require("../Controllers/listing.js")




//Validation Schema....

const valid = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    else next();
}

//Show the listings...
router.get("/listing", isLogged, wrapAsync(listingController.showlisting))

//Filter ke sath Listing
router.get("/listing/show/:category", wrapAsync(listingController.filter));

// Show the form for add the listing...
router.get("/addListingDetail", isLogged, wrapAsync(listingController.createlisting))

//Add the form....
router.post("/addDetail", upload.single("url"), listingController.edit)

// Show the form for update the listing...

router.get("/listing/edit/:id", isLogged, postlogin, wrapAsync(listingController.showedit))

// Update the form
router.patch("/editDetail/:id", upload.single("url"), valid, wrapAsync(listingController.update));

// Delete the listing....
router.delete("/deleteDetail/:id", isLogged, postlogin, wrapAsync(listingController.destroy))

//Particular Listing dikhayega
router.get("/moreabout/:id", wrapAsync(listingController.final));
module.exports = router;

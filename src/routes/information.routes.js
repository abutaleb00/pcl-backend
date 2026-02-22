const router = require("express").Router();
const controller = require("../controllers/information.controller");
const publicController = require("../controllers/contactPublic.controller");

// 1. Specific routes first
router.get("/public", publicController.getPublicContact);

// 2. Generic/Root routes last
router.get("/", controller.get);
router.post("/save", publicController.create);

module.exports = router;
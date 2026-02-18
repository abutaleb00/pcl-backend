const router = require("express").Router();
const controller = require("../controllers/contactInfo.controller");
const publicController = require("../controllers/contactPublic.controller");

// 1. Specific routes first
router.get("/public", publicController.getPublicContact);

// 2. Generic/Root routes last
router.get("/", controller.get);
router.post("/", controller.save);
router.put("/", controller.save);

module.exports = router;
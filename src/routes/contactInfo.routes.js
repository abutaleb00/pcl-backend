const router = require("express").Router();
const controller = require("../controllers/contactInfo.controller");
const publicController = require("../controllers/contactPublic.controller");

router.get("/", controller.get);
router.post("/", controller.save);
router.put("/", controller.save); // single-record system
router.get("/public", publicController.getPublicContact);

module.exports = router;

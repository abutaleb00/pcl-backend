
const router = require("express").Router();
const ctrl = require("../controllers/contact.controller.js");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", ctrl.getAll);
module.exports = router;

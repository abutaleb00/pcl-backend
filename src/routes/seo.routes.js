const router = require("express").Router();
const controller = require("../controllers/seo.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", controller.getPublic);
router.post("/", verifyToken, isAdmin, controller.save);

module.exports = router;

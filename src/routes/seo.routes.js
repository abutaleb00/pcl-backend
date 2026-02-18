const router = require("express").Router();
const controller = require("../controllers/seo.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// Public Fetch
router.get("/fetch", controller.getSeoByPage);

// Admin Management
router.get("/", [verifyToken, isAdmin], controller.getAll);
router.post("/save", [verifyToken, isAdmin], controller.saveSeo);
router.delete("/:id", [verifyToken, isAdmin], controller.remove);

module.exports = router;


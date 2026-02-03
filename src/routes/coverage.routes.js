
const router = require("express").Router();
const ctrl = require("../controllers/coverage.controller.js");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);
module.exports = router;

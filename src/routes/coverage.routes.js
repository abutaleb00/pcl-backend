
const router = require("express").Router();
const ctrl = require("../controllers/coverage.controller.js");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.put("/:id", ctrl.update);
router.get("/:id", ctrl.getById);
router.get("/check/:upazilaId", ctrl.getByUpazila);
router.get("/tree", ctrl.getFullTree);
router.delete("/:id", ctrl.delete);
module.exports = router;

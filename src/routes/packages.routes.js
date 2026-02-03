
const router = require("express").Router();
const controller = require("../controllers/package.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/", verifyToken, isAdmin, controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", verifyToken, isAdmin, controller.update);
router.delete("/:id", verifyToken, isAdmin, controller.remove);
module.exports = router;

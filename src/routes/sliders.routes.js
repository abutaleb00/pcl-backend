
const router = require("express").Router();
const controller = require("../controllers/slider.controller");
const upload = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", upload.array("images", 5), verifyToken, isAdmin, controller.create);
router.put("/:id", upload.array("images", 5), verifyToken, isAdmin, controller.update);
router.delete("/:id", verifyToken, isAdmin, controller.remove);
module.exports = router;

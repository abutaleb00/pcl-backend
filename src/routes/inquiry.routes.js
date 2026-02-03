const router = require("express").Router();
const inquiry = require("../controllers/inquiry.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/", inquiry.create); // public
router.get("/", verifyToken, isAdmin, inquiry.getAll);
router.put("/:id", verifyToken, isAdmin, inquiry.update);
router.delete("/:id", verifyToken, isAdmin, inquiry.remove);

module.exports = router;

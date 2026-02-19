const router = require("express").Router();
const clients = require("../controllers/partner.controller");
const upload = require("../middlewares/clientLogo");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// Public Route
router.get("/public", clients.findAllPublic);

// Admin Routes
router.get("/:id", [verifyToken, isAdmin], clients.findOne);
router.post("/",  verifyToken, isAdmin, upload.single("logo"), clients.create);
router.put("/:id", verifyToken, isAdmin, upload.single("logo"), clients.update);
router.delete("/:id", [verifyToken], clients.delete);

module.exports = router;
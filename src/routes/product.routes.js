const router = require("express").Router();
const products = require("../controllers/product.controller");
const upload = require("../middlewares/productLogo");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// Public access
router.get("/public", products.findAllPublic);

// Admin access
router.get("/:id", [verifyToken, isAdmin], products.findOne);
router.post("/", [verifyToken, isAdmin], upload.single("logo"), products.create);
router.put("/:id", [verifyToken, isAdmin], upload.single("logo"), products.update);
router.delete("/:id", [verifyToken, isAdmin], products.delete);

module.exports = router;
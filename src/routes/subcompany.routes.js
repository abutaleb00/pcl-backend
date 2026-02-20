const router = require("express").Router();
const subCompanies = require("../controllers/subcompany.controller");
const upload = require("../middlewares/subCompanyLogo")
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/public", subCompanies.findAllPublic);
router.get("/:id", [verifyToken, isAdmin], subCompanies.findOne);
router.post("/", verifyToken, isAdmin, upload.single("logo"), subCompanies.create);
router.put("/:id", verifyToken, isAdmin, upload.single("logo"), subCompanies.update);
router.delete("/:id", [verifyToken, isAdmin], subCompanies.delete);

module.exports = router;
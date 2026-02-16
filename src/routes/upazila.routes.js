const express = require("express");
const router = express.Router();
const upazilaController = require("../controllers/upazila.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/", verifyToken, isAdmin, upazilaController.create);
router.get("/", upazilaController.getAll);
router.get("/district/:districtId", upazilaController.getByDistrict);
router.get("/:id", upazilaController.getById);
router.put("/:id", verifyToken, isAdmin, upazilaController.update);
router.delete("/:id", verifyToken, isAdmin, upazilaController.delete);

module.exports = router;

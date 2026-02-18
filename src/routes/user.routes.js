const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");
// List users
router.get("/", userController.getAll);

// Active / Deactive
router.patch("/:id/toggle-status", verifyToken, isAdmin, userController.toggleActive);
router.get("/me", verifyToken, userController.getProfile);
// Soft delete
router.delete("/:id", verifyToken, isAdmin, userController.softDelete);

// Restore (optional)
router.patch("/:id/restore", verifyToken, isAdmin, userController.restore);

router.put("/profile", verifyToken, userController.updateProfile);

router.put("/profile/password", verifyToken, userController.changePassword);

// admin
router.put("/admin/users/:id", verifyToken, isAdmin, userController.adminUpdateUser);
module.exports = router;

const router = require("express").Router();
const dashboard = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", verifyToken, isAdmin, dashboard.getDashboard);

module.exports = router;

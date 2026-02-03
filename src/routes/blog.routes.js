const router = require("express").Router();
const blog = require("../controllers/blog.controller");
const upload = require("../middlewares/uploadBlog");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/* ======================
   Public routes
====================== */
router.get("/", blog.getAll);                 // list blogs
router.get("/slug/:slug", blog.getBySlug);    // SEO friendly single blog

/* ======================
   Admin routes
====================== */
router.post(
    "/",
    verifyToken,
    isAdmin,
    upload.single("featured_image"),
    blog.create
);

router.put(
    "/:id",
    verifyToken,
    isAdmin,
    upload.single("featured_image"),
    blog.updateById
);

router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    blog.removeById
);

module.exports = router;

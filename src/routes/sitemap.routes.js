const router = require("express").Router();
const sitemap = require("../controllers/sitemap.controller");

router.get("/sitemap.xml", sitemap.generateSitemap);

module.exports = router;

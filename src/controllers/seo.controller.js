const { SeoSetting } = require("../models");

// 1. GET ALL (For Admin Table List)
exports.getAll = async (req, res) => {
    try {
        const list = await SeoSetting.findAll({ order: [['id', 'DESC']] });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**
 * GET SEO data for a specific page or blog
 * URL Example: /api/seo/fetch?page=about
 * URL Example: /api/seo/fetch?blog_id=12
 */
exports.getSeoByPage = async (req, res) => {
    try {
        const { page, blog_id } = req.query;

        // Build the search query
        let query = {};

        if (blog_id) {
            // If it's a blog, prioritize the blog_id
            query = { blog_id: blog_id };
        } else if (page) {
            // Clean the slug (remove slashes)
            const slug = page.replace(/^\/|\/$/g, '') || 'home';
            query = { page: slug };
        } else {
            // Default to home if nothing is provided
            query = { page: 'home' };
        }

        let seo = await SeoSetting.findOne({ where: query });

        // Fallback Logic: If page-specific SEO is missing, return Home SEO
        if (!seo && query.page !== 'home') {
            seo = await SeoSetting.findOne({ where: { page: 'home' } });
        }

        if (!seo) {
            return res.status(404).json({ message: "No SEO data found." });
        }

        res.json(seo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. UPSERT (Create or Update - For Admin Form)
exports.saveSeo = async (req, res) => {
    try {
        const { page, blog_id } = req.body;

        if (!page) return res.status(400).json({ message: "Page identifier required" });

        // Check if config already exists for this page or blog_id
        const condition = blog_id ? { blog_id } : { page };

        const [record, created] = await SeoSetting.findOrCreate({
            where: condition,
            defaults: req.body
        });

        if (!created) {
            await record.update(req.body);
        }

        res.json({
            message: created ? "SEO created" : "SEO updated",
            data: record
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. DELETE
exports.remove = async (req, res) => {
    try {
        await SeoSetting.destroy({ where: { id: req.params.id } });
        res.json({ message: "SEO configuration deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const { Blog } = require("../models");

exports.generateSitemap = async (req, res) => {
    try {
        const baseUrl = process.env.APP_URL || "https://yourdomain.com";

        const blogs = await Blog.findAll({
            where: { status: "published" },
            attributes: ["slug", "updatedAt"]
        });

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>`;
        sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        /* ======================
           STATIC PAGES
        ====================== */
        sitemap += `
      <url>
        <loc>${baseUrl}/</loc>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/blogs</loc>
        <priority>0.8</priority>
      </url>
    `;

        /* ======================
           BLOG PAGES
        ====================== */
        blogs.forEach(blog => {
            sitemap += `
        <url>
          <loc>${baseUrl}/blogs/${blog.slug}</loc>
          <lastmod>${blog.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `;
        });

        sitemap += `</urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(sitemap);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

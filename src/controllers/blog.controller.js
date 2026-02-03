const { Blog, User } = require("../models");
const slugify = require("slugify");
const path = require("path");
const { Op } = require("sequelize");
/* =====================================
   CREATE BLOG (ADMIN)
===================================== */
exports.create = async (req, res) => {
    try {
        const {
            title,
            short_description,
            content,
            meta_title,
            meta_description,
            meta_keywords,
            status
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        // Generate slug
        let baseSlug = slugify(title, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;

        while (await Blog.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${count++}`;
        }

        const blog = await Blog.create({
            title,
            slug,
            short_description,
            content,
            meta_title: meta_title || title,
            meta_description,
            meta_keywords,
            og_title: meta_title || title,
            og_description: meta_description,
            featured_image: req.file
                ? `/uploads/blogs/${req.file.filename}`
                : null,
            status,
            publishedAt: status === "published" ? new Date() : null,
            UserId: req.user.id
        });

        res.status(201).json(blog);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =====================================
   PUBLIC BLOG LIST (SEO SAFE)
===================================== */
exports.getAll = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            where: { status: "published" },
            attributes: [
                "id",
                "title",
                "slug",
                "short_description",
                "featured_image",
                "publishedAt"
            ],
            order: [["publishedAt", "DESC"]],
            include: [
                {
                    model: User,
                    attributes: ["id", "name"]
                }
            ]
        });

        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =====================================
   SINGLE BLOG BY SLUG (PUBLIC)
===================================== */
exports.getBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                slug: req.params.slug,
                status: "published"
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "name"]
                }
            ]
        });

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =====================================
   UPDATE BLOG (ADMIN | BY ID)
===================================== */

exports.updateById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    let finalSlug = blog.slug;

    /* ==========================
       SLUG LOGIC (FIXED)
    ========================== */

    // 1️⃣ If slug is explicitly provided
    if (req.body.slug && req.body.slug !== blog.slug) {
      let baseSlug = slugify(req.body.slug, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 1;

      while (
        await Blog.findOne({
          where: {
            slug,
            id: { [Op.ne]: blog.id }
          }
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }

      finalSlug = slug;
    }

    // 2️⃣ Else if title changed and slug not provided
    else if (req.body.title && req.body.title !== blog.title) {
      let baseSlug = slugify(req.body.title, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 1;

      while (
        await Blog.findOne({
          where: {
            slug,
            id: { [Op.ne]: blog.id }
          }
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }

      finalSlug = slug;
    }

    /* ==========================
       UPDATE BLOG
    ========================== */
    await blog.update({
      title: req.body.title || blog.title,
      slug: finalSlug,
      short_description:
        req.body.short_description ?? blog.short_description,
      content: req.body.content ?? blog.content,
      meta_title: req.body.meta_title ?? blog.meta_title,
      meta_description:
        req.body.meta_description ?? blog.meta_description,
      meta_keywords:
        req.body.meta_keywords ?? blog.meta_keywords,
      og_title: req.body.meta_title ?? blog.og_title,
      og_description:
        req.body.meta_description ?? blog.og_description,
      featured_image: req.file
        ? `/uploads/blogs/${req.file.filename}`
        : blog.featured_image,
      status: req.body.status ?? blog.status,
      publishedAt:
        req.body.status === "published" && !blog.publishedAt
          ? new Date()
          : blog.publishedAt
    });

    res.json({
      message: "Blog updated successfully",
      slug: finalSlug
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* =====================================
   DELETE BLOG (ADMIN | BY ID)
===================================== */
exports.removeById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        await blog.destroy();
        res.json({ message: "Blog deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

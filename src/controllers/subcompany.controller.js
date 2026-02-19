const db = require("../models");
const SubCompany = db.SubCompany;
const fs = require("fs");
const path = require("path");

exports.findAllPublic = async (req, res) => {
    try {
        const companies = await SubCompany.findAll({
            where: { is_active: true },
            order: [['order', 'ASC'], ['id', 'DESC']]
        });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const company = await SubCompany.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: "Company not found" });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, order, link, description } = req.body;
        const logoPath = req.file ? `/uploads/subcompany/${req.file.filename}` : null;

        if (!logoPath) return res.status(400).json({ error: "Company logo is required" });

        const company = await SubCompany.create({
            name,
            link,
            description,
            logo: logoPath,
            order: order || 0,
        });

        res.status(201).json({ message: "Sub-company created successfully", company });
    } catch (err) {
        if (req.file) {
            const uploadedPath = path.join(process.cwd(), `/uploads/sub-companies/${req.file.filename}`);
            if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
        }
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, is_active, order, link, description } = req.body;
        const company = await SubCompany.findByPk(req.params.id);

        if (!company) return res.status(404).json({ message: "Company not found" });

        let logoPath = company.logo;
        if (req.file) {
            const oldPath = path.join(process.cwd(), company.logo);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            logoPath = `/uploads/subcompany/${req.file.filename}`;
        }

        await company.update({
            name: name || company.name,
            link: link || company.link,
            description: description || company.description,
            is_active: is_active !== undefined ? is_active : company.is_active,
            order: order !== undefined ? order : company.order,
            logo: logoPath
        });

        res.json({ message: "Company updated successfully", company });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const company = await SubCompany.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: "Company not found" });

        const imagePath = path.join(process.cwd(), company.logo);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        await company.destroy();
        res.json({ message: "Company deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
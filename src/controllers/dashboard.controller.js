const db = require("../models");
const { Op } = require("sequelize");

exports.getDashboard = async (req, res) => {
    try {

        const User = db.User;
        const Package = db.Package;
        const Service = db.Service;
        const Coverage = db.Coverage;
        const Blog = db.Blog;
        if (!User || !Package) {
            return res.status(500).json({
                message: "Models not loaded correctly. Check models/index.js"
            });
        }

        /* ===================== COUNTS ===================== */

        const totalUsers = await User.count();

        const activeUsers = await User.count({
            where: { status: 1 }
        });

        const inactiveUsers = await User.count({
            where: { status: 0 }
        });

        const totalPackages = await Package.count({
            where: { status: 1 }
        });

        const totalServices = Service ? await Service.count() : 0;

        const coverageAvailable = Coverage
            ? await Coverage.count({ where: { available: 1 } })
            : 0;
        const totalBlogs = await Blog.count();
        /* ===================== POPULAR PACKAGE ===================== */

        const popularPackage = await Package.findOne({
            where: { status: 1, isPopular: 1 },
            attributes: ["id", "name", "price", "speed"],
            order: [["price", "DESC"]]
        });

        /* ===================== LATEST USERS ===================== */

        const latestUsers = await User.findAll({
            attributes: ["id", "name", "email", "created_at", "status"],
            order: [["created_at", "DESC"]],
            limit: 5
        });

        /* ===================== LATEST PACKAGES ===================== */

        const latestPackages = await Package.findAll({
            attributes: ["id", "name", "price", "speed", "createdAt"],
            where: { status: 1 },
            order: [["createdAt", "DESC"]],
            limit: 5
        });

        /* ===================== MONTHLY USER REGISTRATION (CHART DATA) ===================== */

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const monthlyUsers = await User.findAll({
            attributes: [
                [db.Sequelize.fn("MONTH", db.Sequelize.col("created_at")), "month"],
                [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "total"]
            ],
            where: {
                created_at: { [Op.gte]: startOfYear }
            },
            group: ["month"],
            order: [[db.Sequelize.literal("month"), "ASC"]]
        });

        // Format for frontend chart
        const monthLabels = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyChart = new Array(12).fill(0);

        monthlyUsers.forEach(row => {
            const m = row.get("month");
            const t = row.get("total");
            monthlyChart[m - 1] = t;
        });

        /* ===================== RESPONSE ===================== */

        res.json({
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalPackages,
                totalServices,
                coverageAvailable,
                totalBlogs
            },

            popularPackage,

            latestUsers,
            latestPackages,

            charts: {
                userRegistrations: {
                    labels: monthLabels,
                    data: monthlyChart
                }
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            message: "Dashboard failed",
            error: error.message
        });
    }
};

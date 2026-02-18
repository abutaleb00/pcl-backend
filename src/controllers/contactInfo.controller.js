const { ContactInfo, Contact, ContactPhone, ContactEmail, sequelize } = require("../models");

/**
 * ===============================
 * GET CONTACT INFO (ADMIN)
 * ===============================
 */
exports.get = async (req, res) => {
    try {
        const info = await ContactInfo.findOne();
        let formattedInfo = info ? info.toJSON() : null;
        if (formattedInfo && formattedInfo.socials) {
            formattedInfo.socials = typeof formattedInfo.socials === 'string'
                ? JSON.parse(formattedInfo.socials)
                : formattedInfo.socials;
        }

        const contact = await Contact.findOne({
            include: [
                {
                    model: ContactPhone,
                    as: "phones",
                    attributes: ["id", "phone", "contact_name"]
                },
                {
                    model: ContactEmail,
                    as: "emails",
                    attributes: ["id", "email", "contact_name"]
                }
            ]
        });

        res.json({
            info: formattedInfo || {
                company_name: "", address: "", map_embed: "",
                map_url: "", socials: []
            },
            contact: contact || { phones: [], emails: [] }
        });
    } catch (err) {
        console.error("Admin Get Contact Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * ===============================
 * CREATE / UPDATE CONTACT INFO
 * ===============================
 */
exports.save = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { company_name, address, map_embed, map_url, socials, phones, emails } = req.body;

        // ১. ContactInfo আপডেট বা তৈরি (Socials-সহ)
        let contactInfo = await ContactInfo.findOne({ transaction: t });

        // socials অ্যারে থাকলে তাকে স্ট্রিং হিসেবে সেভ করা (যদি মডেলে getter/setter না থাকে)
        const infoPayload = {
            company_name,
            address,
            map_embed,
            map_url,
            socials: typeof socials === 'object' ? JSON.stringify(socials) : socials
        };

        if (!contactInfo) {
            contactInfo = await ContactInfo.create(infoPayload, { transaction: t });
        } else {
            await contactInfo.update(infoPayload, { transaction: t });
        }

        // ২. মাস্টার Contact টেবিল নিশ্চিত করা
        let contact = await Contact.findOne({ transaction: t });
        if (!contact) {
            contact = await Contact.create({ address, map_url }, { transaction: t });
        } else {
            await contact.update({ address, map_url }, { transaction: t });
        }

        // ৩. ডাইনামিক ফোন নম্বর সিঙ্ক (Wipe & Rewrite)
        await ContactPhone.destroy({ where: { contact_id: contact.id }, transaction: t });
        if (phones && Array.isArray(phones)) {
            const phoneData = phones
                .filter(p => p.phone && p.phone.trim() !== "")
                .map(p => ({
                    contact_id: contact.id,
                    contact_name: p.contact_name || "General",
                    phone: p.phone
                }));
            await ContactPhone.bulkCreate(phoneData, { transaction: t });
        }

        // ৪. ডাইনামিক ইমেইল সিঙ্ক (Wipe & Rewrite)
        await ContactEmail.destroy({ where: { contact_id: contact.id }, transaction: t });
        if (emails && Array.isArray(emails)) {
            const emailData = emails
                .filter(e => e.email && e.email.trim() !== "")
                .map(e => ({
                    contact_id: contact.id,
                    contact_name: e.contact_name || "Support",
                    email: e.email
                }));
            await ContactEmail.bulkCreate(emailData, { transaction: t });
        }

        await t.commit();
        res.json({ message: "Identity and contact information synchronized successfully!" });
    } catch (err) {
        await t.rollback();
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to update contact info. " + err.message });
    }
};

/**
 * ===============================
 * GET PUBLIC CONTACT INFO
 * ===============================
 */
exports.getPublicContact = async (req, res) => {
    try {
        const info = await ContactInfo.findOne({
            attributes: { exclude: ['id', 'created_at', 'updated_at'] }
        });

        const contact = await Contact.findOne({
            attributes: ['address', 'map_url'],
            include: [
                { model: ContactPhone, as: 'phones', attributes: ['phone', 'contact_name'] },
                { model: ContactEmail, as: 'emails', attributes: ['email', 'contact_name'] }
            ]
        });

        let socials = [];
        if (info && info.socials) {
            socials = typeof info.socials === 'string' ? JSON.parse(info.socials) : info.socials;
        }

        res.json({
            company: {
                ...info?.toJSON(),
                socials: socials
            },
            details: contact
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching public info" });
    }
};
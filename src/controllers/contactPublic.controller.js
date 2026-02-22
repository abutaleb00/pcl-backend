const {
    ContactInfo,
    Contact,
    ContactPhone,
    ContactEmail,
    sequelize
} = require("../models");

exports.getPublicContact = async (req, res) => {
    try {
        const info = await ContactInfo.findOne({
            attributes: { exclude: ['id', 'created_at'] }
        });

        let parsedSocials = [];
        if (info && info.socials) {
            try {
                parsedSocials = typeof info.socials === 'string'
                    ? JSON.parse(info.socials)
                    : info.socials;
            } catch (e) {
                console.error("Socials parsing error:", e);
                parsedSocials = [];
            }
        }
        const details = await Contact.findOne({
            attributes: ['address', 'map_url'],
            include: [
                {
                    model: ContactPhone,
                    as: 'phones',
                    attributes: ['phone', 'contact_name']
                },
                {
                    model: ContactEmail,
                    as: 'emails',
                    attributes: ['email', 'contact_name']
                }
            ]
        });

        res.json({
            company: {
                company_name: info?.company_name || "",
                address: info?.address || details?.address || "",
                map_embed: info?.map_embed || "",
                map_url: info?.map_url || details?.map_url || "",
                socials: parsedSocials
            },
            phones: details?.phones || [],
            emails: details?.emails || []
        });

    } catch (err) {
        console.error("Public Contact Error:", err);
        res.status(500).json({ error: "Internal server error fetching contact info." });
    }
};
exports.create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { company_name, address, map_embed, map_url, socials, phones, emails } = req.body;
        let contactInfo = await ContactInfo.findOne({ transaction: t });
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

        let contact = await Contact.findOne({ transaction: t });
        if (!contact) {
            contact = await Contact.create({ address, map_url }, { transaction: t });
        } else {
            await contact.update({ address, map_url }, { transaction: t });
        }

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
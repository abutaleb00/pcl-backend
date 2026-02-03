const {
    ContactInfo,
    Contact,
    ContactPhone,
    ContactEmail
} = require("../models");

exports.getPublicContact = async (req, res) => {
    try {
        const info = await ContactInfo.findOne();

        const contact = await Contact.findOne({
            include: [
                { model: ContactPhone, as: "phones", attributes: ["phone"] },
                { model: ContactEmail, as: "emails", attributes: ["email"] }
            ]
        });

        res.json({
            company_name: info?.company_name || null,
            address: info?.address || null,
            phone: contact?.phones?.map(p => p.phone) || [],
            email: contact?.emails?.map(e => e.email) || [],
            map_embed: info?.map_embed || null,
            map_url: info?.map_url || null,
            facebook: info?.facebook || null,
            whatsapp: info?.whatsapp || null
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

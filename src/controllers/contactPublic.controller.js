const {
    ContactInfo,
    Contact,
    ContactPhone,
    ContactEmail
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

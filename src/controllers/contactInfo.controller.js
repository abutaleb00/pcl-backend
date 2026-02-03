const {
    ContactInfo,
    Contact,
    ContactPhone,
    ContactEmail
} = require("../models");

/**
 * ===============================
 * GET CONTACT INFO (ADMIN)
 * ===============================
 */
exports.get = async (req, res) => {
    try {
        const info = await ContactInfo.findOne();

        const contact = await Contact.findOne({
            include: [
                {
                    model: ContactPhone,
                    as: "phones",
                    attributes: ["id", "phone"]
                },
                {
                    model: ContactEmail,
                    as: "emails",
                    attributes: ["id", "email"]
                }
            ]
        });

        res.json({
            info: info || null,
            contact: contact || { phones: [], emails: [] }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * ===============================
 * CREATE / UPDATE CONTACT INFO
 * ===============================
 */
exports.save = async (req, res) => {
    try {
        const {
            company_name,
            address,
            map_embed,
            map_url,
            facebook,
            whatsapp,
            phones = [],
            emails = []
        } = req.body;

        /* ---------------------------
           ContactInfo (single row)
        ---------------------------- */
        let info = await ContactInfo.findOne();

        if (!info) {
            info = await ContactInfo.create({
                company_name,
                address,
                map_embed,
                map_url,
                facebook,
                whatsapp
            });
        } else {
            await info.update({
                company_name,
                address,
                map_embed,
                map_url,
                facebook,
                whatsapp
            });
        }

        /* ---------------------------
           Contact (single row)
        ---------------------------- */
        let contact = await Contact.findOne();
        if (!contact) {
            contact = await Contact.create({});
        }

        /* ---------------------------
           Reset phones & emails
        ---------------------------- */
        await ContactPhone.destroy({
            where: { contact_id: contact.id }
        });

        await ContactEmail.destroy({
            where: { contact_id: contact.id }
        });

        if (phones.length > 0) {
            await ContactPhone.bulkCreate(
                phones.map(p => ({
                    phone: p.phone,
                    contact_id: contact.id
                }))
            );
        }

        if (emails.length > 0) {
            await ContactEmail.bulkCreate(
                emails.map(e => ({
                    email: e.email,
                    contact_id: contact.id
                }))
            );
        }

        res.json({
            message: "Contact info saved successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

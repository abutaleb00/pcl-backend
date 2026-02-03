
const db = require("../models");
exports.getAll = async (req,res)=>{
  const data = await db.Contact.findAll({ include: { all: true }});
  res.json(data);
};

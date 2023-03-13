const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

module.exports= mongoose.connect(process.env.CONSTR);
const mongoose = require("mongoose");
const URL = process.env.DB_URL || "127.0.0.1";
mongoose.connect(`mongodb://${URL}/cowin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = {};

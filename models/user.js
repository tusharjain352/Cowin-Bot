const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  user_id: {
    type: Number,
    unique: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
  usageCount: {
    type: Number,
    default: 1,
  },
});

const userModel = mongoose.model("user", new mongoose.Schema(userSchema));

module.exports = {
  userModel,
};

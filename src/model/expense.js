const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", schema);
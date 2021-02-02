const mongoose = require("mongoose");

const nameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99,
  },
  translations: Array,
});

const Name = mongoose.model("Name", nameSchema);

module.exports = Name;

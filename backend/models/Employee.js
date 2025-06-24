const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  jobTitle: { type: String, required: true },
  department: { type: String },
  hireDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Employee", employeeSchema);

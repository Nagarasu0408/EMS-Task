const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    unique_employee_id: { type: String, required: true, unique: true },
    image: { type: String },
    name: { type: String, required: true },
    mobile_no: { type: String },
    designation: { type: String },
    gender: { type: String },
    course: { type: String },
    create_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', EmployeeSchema);

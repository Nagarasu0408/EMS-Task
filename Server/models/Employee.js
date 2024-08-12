// const mongoose = require('mongoose');


// // Employee details
// const EmployeeSchema = new mongoose.Schema({
//     unique_employee_id: { type: String, required: true, unique: true },
//     image: { type: String },
//     name: { type: String, required: true },
//     email: { type: String },
//     mobile_no: { type: String },
//     designation: { type: String },
//     gender: { type: String },
//     course: { type: Array },
//     create_date: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Employee', EmployeeSchema);



const mongoose = require('mongoose');
const moment = require('moment');

// Employee details
const EmployeeSchema = new mongoose.Schema({
    unique_employee_id: { type: String, required: true, unique: true },
    image: { type: String },
    name: { type: String, required: true },
    email: { type: String },
    mobile_no: { type: String },
    designation: { type: String },
    gender: { type: String },
    course: { type: Array },
    create_date: {
        type: Date,
        default: Date.now,
        get: (value) => moment(value).format('DD-MMM-YYYY'),
        set: (value) => moment(value, 'DD-MMM-YYYY').toDate()
    },
});



// Ensure getters are applied when converting to JSON
EmployeeSchema.set('toJSON', { getters: true });
EmployeeSchema.set('toObject', { getters: true });

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;

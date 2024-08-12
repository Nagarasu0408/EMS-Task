const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Route to fetch all employees
router.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to add a new employee
router.post('/employee', async (req, res) => {
    const {
        unique_employee_id,
        image,
        name,
        email,
        mobile_no,
        designation,
        gender,
        course,
    } = req.body;

    try {
        let newEmployee = new Employee({
            unique_employee_id,
            image,
            name,
            email,
            mobile_no,
            designation,
            gender,
            course,
        });

        newEmployee = await newEmployee.save();

        res.status(201).json(newEmployee);
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to delete an employee by ID
router.delete('/employee/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update an employee by ID
router.put('/employee/:id', async (req, res) => {
    const {
        unique_employee_id,
        image,
        name,
        email,
        mobile_no,
        designation,
        gender,
        course,
    } = req.body;

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                unique_employee_id,
                image,
                name,
                email,
                mobile_no,
                designation,
                gender,
                course,
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

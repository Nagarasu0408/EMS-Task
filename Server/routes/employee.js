const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 'uploads' is the directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp to avoid conflicts
    }
});

const upload = multer({ storage: storage });

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
router.post('/employee', upload.single('image'), async (req, res) => {
    const {
        unique_employee_id,
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
            image: req.file ? req.file.filename : '', // Save filename in the database
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
router.put('/employee/:id', upload.single('image'), async (req, res) => {
    const {
        unique_employee_id,
        name,
        email,
        mobile_no,
        designation,
        gender,
        course,
    } = req.body;

    // Handle the image file if it's uploaded
    let image = req.body.image; // Default to the image URL if already stored
    if (req.file) {
        image = req.file.filename; // Or req.file.path, depending on how you're storing it
    }

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
                course: course.split(','), // If course is a string of comma-separated values
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

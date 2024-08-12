const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

//Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);


// MongoDB connection -- Local machine connection
mongoose.connect('mongodb://localhost:27017/mern-project', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));




// Dashboard route
app.get('/api/dashboard', (req, res) => {
    // Example response
    res.json({ message: 'Welcome to the dashboard' });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api', employeeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

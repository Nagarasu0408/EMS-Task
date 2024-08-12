const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017/mern-project';

let gfs;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Set the collection name
});

module.exports = { gfs };
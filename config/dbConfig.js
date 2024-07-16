const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected...............');
    })
    .catch(err => console.error('MongoDB connection or index setup error:', err));


const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
    };
    
module.exports = connectDB;
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://deshmukharya2803_db_user:<WvnhOnp4AWdBrCLC>@cluster0.azvo3o8.mongodb.net/?appName=Cluster0", {
            // Options are parsed automatically in newer versions of Mongoose
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

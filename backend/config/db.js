const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("process.env.MONGO_URI", {
            // Options are parsed automatically in newer versions of Mongoose
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

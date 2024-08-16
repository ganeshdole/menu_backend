const mongoose = require('mongoose')
const url = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/menu_backend"
const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10, 
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 
        });
        
        conn.connection.on('error', err => {
            console.error(`MongoDB connection error: ${err}`);
        });
        conn.connection.on('dissconected', () =>{
            console.error(`MongoDB dissconected`);
            setTimeout(connectDB, 50000)
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }

}

module.exports = connectDB;
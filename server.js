require('dotenv').config(); // Loads environment variables from the .env file

const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 3000;
const connectDB = require('./src/config/database');
const router = require('./src/routes/index');
app.use(express.json());



app.get("/ping",(req, res)=>{
   return res.send("pong")
})
// Use the router for handling API requests under the /api route
app.use('/api', router);

// Connect to MongoDB and start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server Started On ${port}`);
    });
}).catch((error) => {
    console.log('Error in Connecting MongoDB', error);
});

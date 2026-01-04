const express = require('express');
const app = express();
const morgan = require('morgan');               
const connectDB = require('./src/config/db');
require('dotenv').config();

const userRoutes = require('./src/routes/user.routes');

const PORT = process.env.PORT || 2000;


app.use(express.json());   
app.use(morgan('dev'));                                       


connectDB();


app.get('/', (req, res) => {      
    res.send('Welcome to my Authentication Class!');          
});


app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
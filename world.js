const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 2000

app.use(express.json());

const db = async () => {
    await mongoose.connect('mongodb://localhost:27017/school');
    console.log('Connected to MongoDB');
}

const studentSchema = new mongoose.Schema ({
    name:String,
    age:Number,
    grade:String,
    className:String,
    address:String,
    phone:String
})

const Student = mongoose.model('Student', studentSchema);


app.get('/', (req, res) => {
    res.send('Hello World');

})

app.post('/add-student', async (req, res) => {
    const {name, age, grade, className, address, phone} = req.body;
    try {
        const newStudent = new Student ({name, age, grade, className, address, phone});
        await newStudent.save();
        res.status(201).json('Student added successfully');
    }catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error');
}});

app.listen(port, () => {
    db ();
    console.log(`School app listening at http://localhost:${port}`);
})
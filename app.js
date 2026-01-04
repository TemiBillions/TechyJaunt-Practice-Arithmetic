const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const port = 3501;

app.use(express.json());
app.use(morgan('dev')); //middleware for morgan


app.get("/", (req, res) => {
    res.send('Hello World!!');
});

const connectDb = async () => {
    await mongoose.connect("mongodb://localhost:27017/classDB");
    console.log('Connected to Database');
}


const userSchema = new mongoose.Schema ({
    yourName: String,
    age: Number,
    phoneNumber: String,
    address: String,
    loanAmount: Number,
    loanStatus: Boolean,
    },{
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);

app.post('/apply', async (req, res) => {
    try {
        const { yourName, age, phoneNumber, address, loanAmount } = req.body;
        if (!yourName || !age || !phoneNumber || !address || !loanAmount) {
            return res.status(400).json({message: 'All fields are required.'});
        }
    const newUser = new User({
      yourName,
      age,
      phoneNumber,
      address,
      loanAmount,
      loanStatus: false,
    });
    await newUser.save();
   return res.status(201).json(newUser);
 } catch (error) {
    console.log(error);
   return res.status(500).json({ message: "Server Error" });
    }
  });

app.get('/all-loans', async (req, res) => {
  try {
    const users = await User.find();
   return res.status(200).json({ users, count: users.length });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ message: "Server Error" });
  }
});

app.get('/loan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
   return res.status(500).json({ message: "Server Error" });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const user = await User.findOne({ name });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
   return res.status(500).json({ message: "Server Error" });
  }
});

app.put('/update-loan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, phoneNumber, address, loanAmount }  = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, age, phoneNumber, address, loanAmount },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

app.delete('/delete-loan', async (req, res) => {
    try {
        const { name } = req.query;  
        const deletedUser = await User.findOneAndDelete({ name });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});



app.listen(port, () => {
    connectDb();
    console.log(`App is listening at http://localhost:${port}`);
});
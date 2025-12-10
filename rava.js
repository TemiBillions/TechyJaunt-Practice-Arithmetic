const express = require ('express'); //Import the Express Library
const {subtract, add, multiply, divide} = require ('./sum');
const app = express(); //Create an Express Application
const port = 2500; //Define the port number

app.use(express.json());

app.get('/', (req, res) => {
res.send('Welcome to the Home Page!!!!!'); //Send a response for the/home route
});

// app.post('/post', (req, res) => {
// res.send('POST request received');
// });

// app.put('/put', (req, res) => {
// res.send('PUT request received');
// });

// app.patch('/patch', (req, res) => {
// res.send('PATCH request received');
// });

// app.delete('/delete', (req, res) => {
// res.send('DELETE request received');
// });


app.get('/add', (req, res) => {
    const {a, b} = req.body;
    const sum = add(a, b);
    res.json (`The sum of ${a} and ${b} is ${sum}`);
});

app.get('/subtract', (req, res) => {
    const {a, b} = req.body;
    const difference = subtract(a, b);
    res.json (`The difference between ${a} and ${b} is ${difference}`);
});

app.get('/multiply', (req, res) => {
    const {a, b} = req.body;
    const product = multiply(a, b);
    res.json (`The product of ${a} and ${b} is ${product}`);
});

app.get('/divide', (req, res) => {
    const {a, b} = req.body;
    const quotient = divide(a, b);
    res.json (`The quotient of  ${a} and ${b} is ${quotient}`);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

}); //Start the server and listen on specified port


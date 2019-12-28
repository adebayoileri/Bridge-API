const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express()
dotenv.config();

app.use('/',(req, res)=>{
    res.status.json('Welcome to API')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = 3200 || process.env.PORT;

app.listen(PORT, ()=>{
   console.log(`Server up and running on ${PORT}`);
});

module.exports = app;
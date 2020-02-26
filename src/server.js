const express = require('express');
const { json, urlencoded } = require('body-parser');
const { config } = require('dotenv');
const { logger } = require('morgan');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes =require('./routes/authRoutes');

const app = express()
config();

app.get('/',(req, res)=>{
    res.status(200).json('Welcome to API')
});

// app.use(logger.dev());
app.use(json());
app.use(urlencoded({extended: false}));

// app.use('/api/v1',taskRoutes);
// app.use('/api/v1/auth',authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
   console.log(`Server up and running on ${PORT}`);
});


// Invalid Routes
app.all('*', (req, res) => res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Route unavailable on server.',
  }));

const server = app;
module.exports=app;

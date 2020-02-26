const express = require('express');
import { json, urlencoded } from 'body-parser';
import { config } from 'dotenv';
import { logger } from 'morgan';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';

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

export const server = app;
export default app;

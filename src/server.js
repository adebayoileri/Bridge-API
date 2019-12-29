import express from 'express';
import { json, urlencoded } from 'body-parser';
import { config } from 'dotenv';
import taskRoutes from './routes/taskRoutes';

const app = express()
config();

app.get('/',(req, res)=>{
    res.status(200).json('Welcome to API')
});

app.use(json());
app.use(urlencoded({extended: false}));

app.use('/api/v1',taskRoutes);

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

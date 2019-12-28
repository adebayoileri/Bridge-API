import express from 'express';
import { json, urlencoded } from 'body-parser';
import { config } from 'dotenv';

const app = express()
config();

app.use('/',(req, res)=>{
    res.status.json('Welcome to API')
});

app.use(json());
app.use(urlencoded({extended: false}));

const PORT = 3200 || process.env.PORT;

app.listen(PORT, ()=>{
   console.log(`Server up and running on ${PORT}`);
});

export default app;
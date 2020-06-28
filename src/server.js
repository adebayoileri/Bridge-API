import express from 'express';
import { json, urlencoded } from 'body-parser';
import { config } from 'dotenv';
import expressFileUpload from 'express-fileupload';
import AuthRouters from './routes/authRoutes';
import UploadRouter from './routes/uploadRoute';
// import { logger } from 'morgan';
// import taskRoutes from './routes/taskRoutes';
// import authRoutes from './routes/authRoutes';

const app = express()
config();

app.get('/',(req, res)=>{
    res.status(200).json('Welcome to API')
});

// app.use(logger.dev());
app.use(json());
app.use(urlencoded({extended: false}));

app.use(expressFileUpload({
  useTempFiles: true
}))
// app.use('/api/v1',taskRoutes);
// app.use('/api/v1/auth',authRoutes);

app.use(AuthRouters)
app.use(UploadRouter)

const PORT = process.env.PORT || 3000;

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

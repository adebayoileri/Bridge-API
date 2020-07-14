import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { config } from 'dotenv';
import expressFileUpload from 'express-fileupload';
import passport from 'passport';
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import AuthRouters from './routes/authRoutes';
import logger from 'morgan';
import taskRoutes from './routes/taskRoutes';
import UploadRouter from './routes/uploadRoute';
import categoryRouter from './routes/categoryRoute';
import reviewRouter from './routes/reviewRoutes';
import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';
import cluster from "cluster";
import os from "os";

const app = express()
config();

app.use(cors())

// added condition for logger to use tiny in production, for improving load time in production
app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny'));
app.use(helmet())
app.use(compression())

app.use(json());


app.use(passport.initialize());
app.use(passport.session());

app.use(urlencoded({extended: false}));

app.use(expressFileUpload({
  useTempFiles: true
}))



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.get('/',(req, res)=>{
  res.status(200).json('Welcome to Bridge API')
});

app.use('/api/v1/',taskRoutes);

app.use('/api/v1/auth', AuthRouters);

app.use('/api/v1/', UploadRouter)

app.use('/api/v1/', categoryRouter);

app.use('/api/v1/', reviewRouter);

app.use('/api/v1/', userRouter);

app.use('/api/v1/', adminRouter);

const PORT = process.env.PORT || 3200;
if(cluster.isMaster && !process.env.NODE_ENV == 'test'){
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  
}else{
  app.listen(PORT, ()=>{
    console.log(`Server up and running on ${PORT}`);
    console.log(`Worker ${process.pid} started`);
  });
}



// Invalid Routes
app.all('*', (req, res) => res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Route unavailable on server.',
  }));

export const server = app;
export default app;

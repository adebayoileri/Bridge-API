import { Client, Pool } from "pg";
import 'dotenv/config';

if (process.env.NODE_ENV === "development"){
  let connectionString ={
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    server:process.env.DB_SERVER,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
}
}else{
  let connectionString = process.env.DB_URL;
}

const pool = new Pool({
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  server:process.env.DB_SERVER,
  port:process.env.DB_PORT,
  database:process.env.DB_NAME,
    // ssl:true,
})

pool.on('connect',()=>{ });

// UserTable();

export default pool;

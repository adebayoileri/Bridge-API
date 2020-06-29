import { Client, Pool } from "pg";
import 'dotenv/config';

// let pool
// if (process.env.NODE_ENV === "development"){
//   let connectionString = {
//     user:process.env.DB_USERNAME,
//     password:process.env.DB_PASSWORD,
//     server:process.env.DB_SERVER,
//     port:process.env.DB_PORT,
//     database:process.env.DB_NAME
// }
//  pool = new Pool({
//   connectionString,

// })
// }else{
//   let connectionString = process.env.DB_URL;
//   pool = new Pool({
//     connectionString,
//       ssl:true,
//   })
// }

 const pool = new Pool({
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  server:process.env.DB_SERVER,
  port:process.env.DB_PORT,
  database:process.env.DB_NAME
})


pool.on('connect',()=>{ console.log('DB Connected')});

// UserTable();

export default pool;

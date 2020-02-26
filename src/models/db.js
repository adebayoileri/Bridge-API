import { Client, Pool } from "pg";
import { dotenv } from "dotenv";

dotenv.config();

// if (process.env.NODE_ENV = 'development'){
//   let connectionString ={
//     user:process.env.DB_USERNAME,
//     password:process.env.DB_PASSWORD,
//     server:process.env.DB_SERVER,
//     port:process.env.DB_PORT,
//     database:process.env.DB_NAME
// }
// }else{
//   const connectionString = process.env.DB_URL;
// }

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl:true,
})


const UserTable = async () => {
    const CreateTable = `CREATE TABLE IF NOT EXISTS
      newusers(
          id SERIAL PRIMARY KEY UNIQUE,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          category VARCHAR(50) NOT NULL, 
          email VARCHAR(50) NOT NULL,
          password VARCHAR(20) NOT NULL
          )`
    try {
      await pool.query(CreateTable)
      console.log('user table created')
  
    }
    catch (e) {
      console.log(e)
    }
  
  }

pool.on('connect',()=>{ });

UserTable();

export default pool;

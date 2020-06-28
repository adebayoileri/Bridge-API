import migrate from "./migration";
import pool from "../models/db";

const migrateDatabase = async() =>{
   try {
       await migrate(pool);
       console.log("Database Migrated SucessFully");
       process.exit()
       
   } catch (error) {
       console.log("An Error occured,for more details" + error)
   }
}
migrateDatabase();
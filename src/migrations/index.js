import migrate from "./migration";
import pool from "../models/db";
import seed from "./seed";

const migrateDatabase = async() =>{
   try {
       await migrate(pool);
       await seed(pool);
       console.log("Database Migrated & Seeded  SucessFully");
       process.exit()     
   } catch (error) {
       console.log("An Error occured,for more details" + error)
   }
}
migrateDatabase();
import migrate from "./migration";
import pool from "../models/db";
import seed from "./seed";

const migrateDatabase = async() =>{
   try {
       await migrate(pool);
       console.log("Database Migrated");
       await seed(pool);
       console.log("Database Seeded  SucessFully");
       process.exit()     
   } catch (error) {
       console.log("An Error occured,for more details" + error)
   }
}
migrateDatabase();
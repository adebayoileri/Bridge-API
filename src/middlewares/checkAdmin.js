import pool from "../models/db";

const checkAdmin = async(email)=>{
    try {
        const adminQuery = `SELECT * FROM users WHERE email=$1`;
        const value = [email]
        const result = await pool.query(adminQuery, value);
        if(result && result.rows[0]['admin'] === true){
            return true
        }

    } catch (error) {
        console.log('Error'+ error)
    }
}

module.exports = checkAdmin;
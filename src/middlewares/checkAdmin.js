import {pool} from "pg";

const checkAdmin = async(id)=>{
    try {
        const adminQuery = `SELECT * users WHERE id=$1`;
        const value = [id]
        const result = await pool.query(adminQuery, value);
        if(result && result.rows[0]['admin'] === 'TRUE'){
            return true
        }

    } catch (error) {
        console.log('Error'+ error)
    }
}

module.exports = checkAdmin;
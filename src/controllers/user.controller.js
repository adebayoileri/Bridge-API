import { pool } from "../models/db";

class userController {
    static async getProfile(req, res){
        const {id}=  req.body;
        try {
            const getUserQuery = `SELECT * FROM users WHERE id=$1`;
            const value = [id];
            const userData = await pool.query(getUserQuery, value);
            if(userData.rows[0]){
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: userData.rows[0]
                })
            }
        } catch (error) {
            console.log('Error'+ err)
        }
    }

    static async editProfile(req, res){
        const {id}=  req.params;
        const {
            // email,
            first_name,
            last_name,
            phonenumber,
            gender_id,
        } = req.body;
        try {
            const getUserQuery = `SELECT * FROM users WHERE id=$1`;
            const value = [id];
            const userData = await pool.query(getUserQuery, value);
            const user = userData.rows[0];
            // const newEmail = email || user.email;
            const newFirstname = first_name || user.first_name;
            const newLastname = last_name || user.last_name;
            const newNumber = phonenumber || user.phonenumber;
            const newGender = gender_id || user.gender_id;

            const editQuery = `UPDATE users SET  first_name=$1, last_name=$2, phonenumber=$3, password=$4, gender_id=$5`;
            const values = [
                newFirstname,
                newLastname,
                newNumber,
                newGender
            ];
            const editedUser = await pool.query(editQuery, values);
            if(editedUser.rows[0]){
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: editedUser.rows[0]
                })
            }
        } catch (error) {
         return res.status(500).json({
             status: "error ",
             code: 500,
             message: "Internal server error"
         })
        }
    }
}

export default userController;
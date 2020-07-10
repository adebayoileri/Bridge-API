import  pool  from "../models/db";
import {validateEditProfile} from '../middlewares/userValidation';
class userController {
    static async getProfile(req, res){
        const {email} = req.user;
        try {
            const getUserQuery = `SELECT * FROM users WHERE email=$1 `;
            const value = [email];
            const userData = await pool.query(getUserQuery, value);

            if(userData.rows[0]){
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: {
                        id : userData.rows[0].id,
                        first_name: userData.rows[0].first_name,
                        last_name : userData.rows[0].last_name,
                        phonenumber: userData.rows[0].phonenumber,
                        admin : userData.rows[0].admin,
                        createdat: userData.rows[0].createdat,
                        updatedat: userData.rows[0].updatedat,
                        pro : userData.rows[0].pro,
                        suspend_status : userData.rows[0].suspend_status,
                        email_verified : userData.rows[0].email_verified,
                        auth_id : userData.rows[0].auth_id,
                        auth_provider : userData.rows[0].auth_provider,
                        gender_id: userData.rows[0].gender_id
                    }
                })
            }
            else{
                return res.status(404).json({
                    status: "error",
                    code: 404,
                    message: "user does not exist"
                })
            }
        } catch (err) {
            console.log('Error'+ err)
        }
    }

    static async editProfile(req, res){
        const {email} = req.user;
        const {
            first_name,
            last_name,
            phonenumber
        } = req.body;

        const responseEditProfileValidation = validateEditProfile({first_name, last_name, phonenumber});
        if(responseEditProfileValidation.error) return res.status(400).json({Error: `${responseEditProfileValidation.error}`})
        
        try {
            const getUserQuery = `SELECT * FROM users WHERE email=$1`;
            const value = [email];
            const userData = await pool.query(getUserQuery, value);
            const user = userData.rows[0];
                if(!user){
                    return res.status(404).json({
                        status: "error",
                        code: 404,
                        message: "user does not exist"
                    })
                }
            const newFirstname = first_name || user.first_name;
            const newLastname = last_name || user.last_name;
            const newNumber = phonenumber || user.phonenumber;

            const editQuery = `UPDATE users SET  first_name=$1, last_name=$2, phonenumber=$3, WHERE email=$4 RETURNING *`;
            const values = [
                newFirstname,
                newLastname,
                newNumber,
                email
            ];
            const editedUser = await pool.query(editQuery, values);
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: {
                        id : editedUser.rows[0].id,
                        first_name: editedUser.rows[0].first_name,
                        last_name : editedUser.rows[0].last_name,
                        phonenumber: editedUser.rows[0].phonenumber,
                        admin : editedUser.rows[0].admin,
                        createdat: editedUser.rows[0].createdat,
                        updatedat: editedUser.rows[0].updatedat,
                        pro : editedUser.rows[0].pro,
                        suspend_status : editedUser.rows[0].suspend_status,
                        email_verified : editedUser.rows[0].email_verified,
                        auth_id : editedUser.rows[0].auth_id,
                        auth_provider : editedUser.rows[0].auth_provider,
                        gender_id: editedUser.rows[0].gender_id
                    }
                })
            
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
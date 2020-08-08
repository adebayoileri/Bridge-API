import  pool  from "../models/db";
import {validateEditProfile} from '../middlewares/userValidation';
import { genSalt } from "bcryptjs";
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
                        email: email,
                        first_name: userData.rows[0].first_name,
                        last_name : userData.rows[0].last_name,
                        profileimg : userData.rows[0].profileimg,
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
            profileimg,
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
                const newProfileimg = profileimg || user.profileimg;
            const newFirstname = first_name || user.first_name;
            const newLastname = last_name || user.last_name;
            const newNumber = phonenumber || user.phonenumber;

            const editQuery = `UPDATE users SET profileimg=$1, first_name=$2, last_name=$3, phonenumber=$4, WHERE email=$5 RETURNING *`;
            const values = [
                newProfileimg,
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
                        profileImg: editedUser.rows[0].profileimg,
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

    static async updatePassword(req, res){
        try{
            const {id, email} = req.user;
            const {newPassword, oldPassword} = req.body;
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword =await bcrypt.hash(newPassword, salt)
            const getUserQuery = `SELECT * FROM users WHERE email=$1`;
            const value = [email];
            const user = await pool.query(getUserQuery, value)
            if(!user.rows[0]){
                return res.status(400).json({
                    status: "failed",
                    message: "user doesn't exist",
                    code: 400
                })
            }
            const hashValue = bcrypt.compareSync(oldPassword, user.rows[0].password);
            if(!hashValue){
                return res.status(400).json({
                    status: "failed",
                    message: "password is incorrect",
                    code: 400
                })
            }
            const updateUserQuery = `UPDATE users SET password=$1, createdat=CURRENT_TIMESTAMP WHERE id=$2`;
            const newValue = [newHashedPassword, id];
            await pool.query(updateUserQuery, newValue);
            return res.status(200).json({
                status: "success",
                code: 200,
                message: "password updated successfully"
            })
        }catch(error){

        }
    }
}

export default userController;
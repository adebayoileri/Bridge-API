import  pool  from "../models/db";
import {validateEditProfile} from '../middlewares/userValidation';
import {setGenderValidation} from '../middlewares/userValidation';
class userController {
    static async getProfile(req, res){
        const {email} = req.user;
        try {
            const getUserQuery = `SELECT * FROM users WHERE email=$1 `;
            const value = [email];
            const userData = await pool.query(getUserQuery, value);

            if(userData.rows[0] && userData.rows[0].gender_id == null){
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
            }else if(userData.rows[0] && userData.rows[0].gender_id !== null){
                const getUserAndGenderQuery = `SELECT * FROM users INNER JOIN genders ON genders.id = users.gender_id  WHERE email=$1 `;
                const value = [email];
                const userDataWithGender = await pool.query(getUserAndGenderQuery, value);
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data:{
                        id : userDataWithGender.rows[0].id,
                        first_name: userDataWithGender.rows[0].first_name,
                        last_name : userDataWithGender.rows[0].last_name,
                        phonenumber: userDataWithGender.rows[0].phonenumber,
                        admin : userDataWithGender.rows[0].admin,
                        createdat: userDataWithGender.rows[0].createdat,
                        updatedat: userDataWithGender.rows[0].updatedat,
                        pro : userDataWithGender.rows[0].pro,
                        suspend_status : userDataWithGender.rows[0].suspend_status,
                        email_verified : userDataWithGender.rows[0].email_verified,
                        auth_id : userDataWithGender.rows[0].auth_id,
                        auth_provider : userDataWithGender.rows[0].auth_provider,
                        gender_id: userDataWithGender.rows[0].gender_id,
                        gender: userDataWithGender.rows[0].gender
                    }
                })
            }else{
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

    static async setGender(req, res){
        const {id} = req.user;
        const GenderName = req.body.gender;

        const responsesetGenderValidation = setGenderValidation({GenderName});
        if(responsesetGenderValidation.error) return res.status(400).json({Error: `${responsesetGenderValidation.error}`})
        
        try {
            if(!GenderName) return res.status(400).json({status: "bad request", message: "all fields required"})
            const getUserQuery = `SELECT * FROM genders WHERE user_id=$1`;
            const value = [id];
            const userGenderData = await pool.query(getUserQuery, value);
            if(!userGenderData.rows[0]){
                const saveGenderQuery = `INSERT INTO genders (gender, user_id) VALUES($1, $2) RETURNING *`;
                const values = [
                    GenderName,
                    id
                ];
                const savedGender = await pool.query(saveGenderQuery, values);

                // save the gender id to the user
                const saveGenderIdToUserQuery = `UPDATE users SET gender_id = $1 WHERE id=$2`;
                const valuesForUserTable = [savedGender.rows[0].id, id];
                const savedGenderIdToUserQuery = await pool.query(saveGenderIdToUserQuery, valuesForUserTable);
                
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: savedGender.rows[0]
                })
            }


            const genderData = userGenderData.rows[0];

            const newGendername = GenderName || genderData.name;

            const editQuery = `UPDATE genders SET  gender=$1 , updatedat=CURRENT_TIMESTAMP WHERE user_id=$2 RETURNING *`;
            const values = [
                newGendername,
                id
            ];
            const editedGenderUser = await pool.query(editQuery, values);
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: editedGenderUser.rows[0]
                })
        } catch (error) {
            console.log(error)
         return res.status(500).json({
             status: "error ",
             code: 500,
             message: "Internal server error"
         })
        }
    }
}

export default userController;
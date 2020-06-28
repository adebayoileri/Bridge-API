import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from '../models/db';


/****
 * @class Authentication
 *
 * @description Sign up and login users
 *
 ****/

class Authentication {

    /*******
     * @static
     *
     * @param {object} request - {email, password} -> The request payload sent to the controller
     * @param {object} response - The response payload sent back from the controller
     *
     * @returns {object}
     *
     * @description This method is used to login in users
     * @memberOf Authentication
     *
     ********/

    static async login(req ,res){
        const email = req.body.email;
        const password  = req.body.password;
        try{
         if(!email || !password){
            return res.json("email and password are required")
        }
         const checkEmail = `SELECT * FROM users WHERE email=$1`
         const value = [email];
          const returnedEmail = await pool.query(checkEmail, value);
            if(!returnedEmail.rows[0]){
                return res.status(400).json({
                status: "bad request",
                message: "incorrect email or password"
                })
            }else if(returnedEmail.rows[0]['suspend_status'] === 'FALSE'){
                return res.status(400).json({
                    status: "bad request",
                    message: "user has been suspended"
                })
            }
        const match = await bcrypt.compare(password, returnedEmail.rows[0].password);
        if(match) {
         jwt.sign({email, password} , process.env.AUTHKEY, {expiresIn : '30d'} , (err, token)=>{
            if(err){
                console.log(err);
            }else{
                return res.status(200).json({
                    status: "ok",
                    message: "signed in successfully",
                    id : returnedEmail.rows[0]["userid"],
                    email: returnedEmail.rows[0]["email"],
                    first_name: returnedEmail.rows[0]["first_name"],
                    last_name: returnedEmail.rows[0]["last_name"],
                    phonenumber: returnedEmail.rows[0]["phonenumber"],
                    createdat: returnedEmail.rows[0]["createdat"],
                    email_verified: returnedEmail.rows[0]["email_verified"],
                    gender_id: returnedEmail.rows[0]["gender_id"],
                    admin: returnedEmail.rows[0]["admin"],
                    auth_provider: returnedEmail.rows[0]["auth_provider"],
                    suspend_status: returnedEmail.rows[0]["suspend_status"],
                    pro: returnedEmail.rows[0]["pro"],
                    token : token
                })
            }
     })
        }else{
         res.status(400).json({status: "bad request", message: "incorrect email or password"})
     }
     
    }catch(err){
            console.log(err)
        }
    }




    /****
     * @static
     *
     * @param {object} request - {email, first_name, last_name, phonenumber, category, admin, password} -> The request payload sent to the controller
     * @param {object} response
     *
     * @returns {object} - status, message, id, email, first_name, last_name, phonenumber, category, createdat, auth_provider
     *
     * @description Sign up users
     * @memberOf Authentication
     *
     *****/

   static async  signUp(req, res) {
       const email = req.body.email;
       const first_name = req.body.first_name;
       const last_name = req.body.last_name;
       const phonenumber = req.body.phonenumber;
       const admin = req.body.admin;
       const password  = req.body.password;

       try {
         if(!email || !first_name || !last_name  || !phonenumber  || !admin || !password){
               return res.json("All fields are required {email, first_name, last_name, phonenumber, category, admin, password}")
          }
         const confirmUniqueEmailQuery = `SELECT * FROM users WHERE email=$1`;
         const value = [email];
         const existedUser = await pool.query(confirmUniqueEmailQuery , value);

         if(existedUser.rows[0]) return  res.status(400).json({status: "bad request", message: "email has been taken"});

                //  hash the incoming password
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(password, salt);

          const userSignupQuery = `INSERT INTO users (email, first_name, last_name, phonenumber, admin, password)
                  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
                const values = [email, first_name, last_name, phonenumber, admin, hashedPassword];
                const signedUser = await pool.query(userSignupQuery, values);
                jwt.sign({email, password} , process.env.AUTHKEY, {expiresIn : '30d'} , (err, token)=>{
                    if(err){
                      return  res.status(400).json(err);
                    }else{
                        return res.status(200).json({
                            status: "ok",
                            message: "Signed up successful",
                            id : signedUser.rows[0]["id"],
                            email: signedUser.rows[0]["email"],
                            first_name: signedUser.rows[0]["first_name"],
                            last_name : signedUser.rows[0]["last_name"],
                            phonenumber: signedUser.rows[0]["phonenumber"],
                            createdat : signedUser.rows[0]["createdat"],
                            admin: signedUser.rows[0]["admin"],
                            auth_provider: signedUser.rows[0]["auth_provider"],
                            token : token
                        })
             }
         })
     }
    catch (err) {
        console.log(err);
    }}
}


export default Authentication;

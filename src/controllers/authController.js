import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../models/db';
import EmailSender from '../services/emailSender';
import checkAdmin from '../middlewares/checkAdmin';
import { validateUserSignup, validateLogin } from '../middlewares/auth';

/**
 * @class Authentication
 *
 * @description Sign up and login users
 *
 **/

class Authentication {
  /**
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
   **/

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.json('email and password are required');
      }

      const responseValidation = validateLogin({ email, password });

      if (responseValidation.error) {
        return res.status(400).json({ Error: `${responseValidation.error}` });
      }

      const checkEmail = `SELECT * FROM users WHERE email=$1`;
      const value = [email];
      const returnedEmail = await pool.query(checkEmail, value);
      if (!returnedEmail.rows[0]) {
        return res.status(400).json({
          status: 'bad request',
          message: 'incorrect email or password',
        });
      } else if (returnedEmail.rows[0]['suspend_status'] === true) {
        return res.status(400).json({
          status: 'bad request',
          message: 'user has been suspended',
        });
      }
      const match = await bcrypt.compare(
        password,
        returnedEmail.rows[0].password,
      );
      if (match) {
        //check if user is an admin and await the result
        const isAdmin = await checkAdmin(returnedEmail.rows[0]['email']);

        // if isAdmin id true give the user an admin token
        if (isAdmin) {
          jwt.sign(
            { email, password, id: returnedEmail.rows[0].id },
            process.env.ADMINKEY,
            { expiresIn: '72h' },
            (err, token) => {
              if (err) {
                return res.status(400).json(err);
              } else {
                return res.status(200).json({
                  status: 'ok',
                  code: 200,
                  message: 'admin login successful',
                  data: {
                    id: returnedEmail.rows[0].id,
                    first_name: returnedEmail.rows[0].first_name,
                    last_name: returnedEmail.rows[0].last_name,
                    profileimg: returnedEmail.rows[0].profileimg,
                    phonenumber: returnedEmail.rows[0].phonenumber,
                    admin: returnedEmail.rows[0].admin,
                    createdat: returnedEmail.rows[0].createdat,
                    updatedat: returnedEmail.rows[0].updatedat,
                    pro: returnedEmail.rows[0].pro,
                    suspend_status: returnedEmail.rows[0].suspend_status,
                    email_verified: returnedEmail.rows[0].email_verified,
                    auth_id: returnedEmail.rows[0].auth_id,
                    auth_provider: returnedEmail.rows[0].auth_provider,
                    gender_id: returnedEmail.rows[0].gender_id,
                  },
                  token: token,
                });
              }
            },
          );
        }

        // else give the user a user token
        jwt.sign(
          {
            email,
            password,
            id: returnedEmail.rows[0].id,
            admin: returnedEmail.rows[0].admin,
          },
          process.env.AUTHKEY,
          { expiresIn: '30d' },
          (err, token) => {
            if (err) {
              return res.status(400).json(err);
            } else {
              return res.status(200).json({
                status: 'ok',
                code: 200,
                message: 'signed in successfully',
                data: {
                  id: returnedEmail.rows[0].id,
                  first_name: returnedEmail.rows[0].first_name,
                  last_name: returnedEmail.rows[0].last_name,
                  profileimg: returnedEmail.rows[0].profileimg,
                  phonenumber: returnedEmail.rows[0].phonenumber,
                  admin: returnedEmail.rows[0].admin,
                  createdat: returnedEmail.rows[0].createdat,
                  updatedat: returnedEmail.rows[0].updatedat,
                  pro: returnedEmail.rows[0].pro,
                  suspend_status: returnedEmail.rows[0].suspend_status,
                  email_verified: returnedEmail.rows[0].email_verified,
                  auth_id: returnedEmail.rows[0].auth_id,
                  auth_provider: returnedEmail.rows[0].auth_provider,
                  gender_id: returnedEmail.rows[0].gender_id,
                },
                token: token,
              });
            }
          },
        );
      } else {
       return res.status(400).json({
          status: 'bad request',
          message: 'incorrect email or password',
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
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
   **/

  static async signUp(req, res) {
    const {
      email,
      first_name,
      last_name,
      phonenumber,
      password,
      adminSignature,
    } = req.body;

    try {
      if (!email || !first_name || !last_name || !phonenumber || !password) {
        return res.status(400).json({
          status: 'bad request',
          code: 400,
          message: 'All fields are required',
        });
      }

      let admin;
      if (adminSignature) {
        if (adminSignature === process.env.ADMIN_SIGNATURE) {
          admin = 'true';
        } else {
          return res.status(400).json({
            status: 'bad request',
            message: 'Incorrect Admin signature',
          });
        }
      } else {
        admin = 'false';
      }

      const responseValidation = validateUserSignup({
        first_name,
        last_name,
        email,
        phonenumber,
        password,
        admin,
      });
      if (responseValidation.error) {
        return res.status(400).json({ Error: `${responseValidation.error}` });
      }

      const confirmUniqueEmailQuery = `SELECT * FROM users WHERE email=$1`;
      const value = [email];
      const existedUser = await pool.query(confirmUniqueEmailQuery, value);

      if (existedUser.rows[0]) {
        return res.status(400).json({
          status: 'bad request',
          code: 400,
          message: 'email has been taken',
        });
      }

      //  hash the incoming password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userSignupQuery = `INSERT INTO users (email, first_name, last_name, phonenumber, admin, password, profileimg)
                  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const values = [
        email,
        first_name,
        last_name,
        phonenumber,
        admin,
        hashedPassword,
        'https://res.cloudinary.com/bridgeng/image/upload/v1595808372/blank-profile-picture_ndet1v.png',
      ];
      const signedUser = await pool.query(userSignupQuery, values);
      if (admin === 'false') {
        // admin is false, signed up as user and recieved user token
        jwt.sign(
          {
            email,
            password,
            id: signedUser.rows[0].id,
            admin: signedUser.rows[0].admin,
          },
          process.env.AUTHKEY,
          { expiresIn: '30d' },
          (err, token) => {
            if (err) {
              return res.status(400).json(err);
            } else {
              EmailSender.sendEmail(
                signedUser.rows[0]['email'],
                signedUser.rows[0]['first_name'],
                'Welcome to Bridge',
                'Your signup was sucessful. Please verify your email',
              );
              return res.status(200).json({
                status: 'ok',
                code: 200,
                message: 'Signed up successful',
                data: {
                  id: signedUser.rows[0].id,
                  first_name: signedUser.rows[0].first_name,
                  last_name: signedUser.rows[0].last_name,
                  profileimg: signedUser.rows[0].profileimg,
                  phonenumber: signedUser.rows[0].phonenumber,
                  admin: signedUser.rows[0].admin,
                  createdat: signedUser.rows[0].createdat,
                  updatedat: signedUser.rows[0].updatedat,
                  pro: signedUser.rows[0].pro,
                  suspend_status: signedUser.rows[0].suspend_status,
                  email_verified: signedUser.rows[0].email_verified,
                  auth_id: signedUser.rows[0].auth_id,
                  auth_provider: signedUser.rows[0].auth_provider,
                  gender_id: signedUser.rows[0].gender_id,
                },
                token: token,
              });
            }
          },
        );
      } else {
        // signed up as an admin and recieved an admin token
        jwt.sign(
          {
            email,
            password,
            id: signedUser.rows[0].id,
            admin: signedUser.rows[0].admin,
          },
          process.env.ADMINKEY,
          { expiresIn: '72h' },
          (err, token) => {
            if (err) {
              return res.status(400).json(err);
            } else {
              return res.status(200).json({
                status: 'ok',
                code: 200,
                message: 'Admin Signed up successful',
                data: {
                  id: signedUser.rows[0].id,
                  first_name: signedUser.rows[0].first_name,
                  last_name: signedUser.rows[0].last_name,
                  profileimg: signedUser.rows[0].profileimg,
                  phonenumber: signedUser.rows[0].phonenumber,
                  admin: signedUser.rows[0].admin,
                  createdat: signedUser.rows[0].createdat,
                  updatedat: signedUser.rows[0].updatedat,
                  pro: signedUser.rows[0].pro,
                  suspend_status: signedUser.rows[0].suspend_status,
                  email_verified: signedUser.rows[0].email_verified,
                  auth_id: signedUser.rows[0].auth_id,
                  auth_provider: signedUser.rows[0].auth_provider,
                  gender_id: signedUser.rows[0].gender_id,
                },
                token: token,
              });
            }
          },
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async forgotPassword() {
    // reqest for password
    // send email
    // check if email exists
    //generate verify code
    // send verify code to email
    // click on link in email
    // verify code else failed
    // given token access to update password
    //sucess
    try {
      const { email } = req.body;
      const confirmUniqueEmailQuery = `SELECT * FROM users WHERE email=$1 RETURING *`;
      const value = [email];
      const existedUser = await pool.query(confirmUniqueEmailQuery, value);

      if (!existedUser.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: "email doesn't exist",
        });
      }
      const reset_token = await crypto.randomBytes(20).toString('hex');

      if (reset_token) {
        const updateUserQuery = `UPDATE users SET reset_password_token=$1 WHERE email=$2`;
        const value = [reset_token, email];
        await pool.query(updateUserQuery, value);
        EmailSender.sendEmail(
          email,
          ' Password Reset For Bridge Nigeria ',
          `<p>Hey ${existedUser.rows[0].first_name}</p><p>You requested password reset link</p> <p>Click on this <a href="${process.env.APP_URL}/api/v1/auth/resetpassword?token=${reset_token}">link</a></p> <p>If you didn't request for this. Please login to update your password for security reasons</p>`,
        );
        res.status(200).json({
          status: 'success',
          message: 'password reset email sent',
          code: 200,
        });
      }
    } catch (error) {}
  }
  static async resetPassword() {
    try {
      const { token } = req.query;
      const { newPassword, confirmPassword } = req.body;
      const findTokenQuery = `SELECT * FROM users WHERE reset_password_token=$1`;
      const value = [token];
      const user = await pool.query(findTokenQuery, value);
      if (!user) {
        return res.status(400).json({
          status: 'failed',
          message: "you can't reset password",
          code: 400,
        });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: 'failed',
          message: 'password is not equal',
          code: 400,
        });
      }
      const salt = bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updatePasswordQuery = `UPDATE users SET password=$1, reset_password_token=$2 WHERE id=$3`;
      const updateValues = [hashedPassword, null, user.rows[0].id];
      await pool.query(updatePasswordQuery, updateValues);

      EmailSender.sendEmail(
        user.rows[0].email,
        'Password Updated',
        `<p>Hey ${user.rows[0].first_name}</p> <p>Your  password has been successfully updated.</p>`,
      );
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'password updated sucessfully',
      });
    } catch (error) {}
  }
}

export default Authentication;

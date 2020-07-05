import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from '../models/db';
import EmailSender from "../services/emailSender";
import checkAdmin from "../middlewares/checkAdmin";

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
      const checkEmail = `SELECT * FROM users WHERE email=$1`;
      const value = [email];
      const returnedEmail = await pool.query(checkEmail, value);
      if (!returnedEmail.rows[0]) {
        return res.status(400).json({
          status: 'bad request',
          message: 'incorrect email or password',
        });
      } else if (returnedEmail.rows[0]['suspend_status'] === 'TRUE') {
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
        if(checkAdmin(returnedEmail.rows[0]['suspend_status'])){
          jwt.sign(
            { email, password },
            process.env.ADMINKEY,
            { expiresIn: '72h' },
            (err, token) => {
              if (err) {
                console.log(err);
              } else {
                return res.status(200).json({
                  status: 'ok',
                  code: 200,
                  message: 'admin login successful',
                  data: returnedEmail.rows[0],
                  token: token,
                });
              }
            },
          );
        }
        jwt.sign(
          { email, password },
          process.env.AUTHKEY,
          { expiresIn: '30d' },
          (err, token) => {
            if (err) {
              console.log(err);
            } else {
              return res.status(200).json({
                status: 'ok',
                code: 200,
                message: 'signed in successfully',
                data: returnedEmail.rows[0],
                token: token,
              });
            }
          },
        );
      } else {
        res.status(400).json({
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
      admin,
      password,
    } = req.body;

    try {
      if (
        !email ||
        !first_name ||
        !last_name ||
        !phonenumber ||
        !admin ||
        !password
      ) {
        return res.status(400).json('All fields are required');
      }
      const confirmUniqueEmailQuery = `SELECT * FROM users WHERE email=$1`;
      const value = [email];
      const existedUser = await pool.query(confirmUniqueEmailQuery, value);

      if (existedUser.rows[0])
        return res
          .status(400)
          .json({
            status: 'bad request',
            code: 400,
            message: 'email has been taken',
          });

      //  hash the incoming password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userSignupQuery = `INSERT INTO users (email, first_name, last_name, phonenumber, admin, password)
                  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const values = [
        email,
        first_name,
        last_name,
        phonenumber,
        admin,
        hashedPassword,
      ];
      const signedUser = await pool.query(userSignupQuery, values);
      jwt.sign(
        { email, password },
        process.env.AUTHKEY,
        { expiresIn: '30d' },
        (err, token) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            EmailSender.sendEmail(signedUser.rows[0]['email'], signedUser.rows[0]['first_name'], "Welcome to Bridge", "Your signup was sucessful. Please verify your email")
            return res.status(200).json({
              status: 'ok',
              code: 200,
              message: 'Signed up successful',
              data: signedUser.rows[0],
              token: token,
            });
          }
        },
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default Authentication;

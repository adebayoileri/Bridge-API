import { Router } from 'express';
import Authentication from '../controllers/authController';
import socialAuth from '../controllers/socialauth.controller';
import '../services/passport';
import passport from 'passport';
import { bcrypt, genSalt } from 'bcryptjs';
import { signInGoogle, saveInfo } from '../controllers/socialauth.controller';
import pool from '../models/db';

const router = Router();

router.post('/signup', Authentication.signUp);
router.post('/login', Authentication.login);
router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/login' }),
  async (req, res) => {
    const user = req.session.passport.user._json;
    const email = user['email'];
    const first_name = user['given_name'];
    const last_name = user['family_name'];
    // console.log(user['email'])
    const admin = false;
    const password = 'fhurfhiruef87420840ytgfy93rfjw$33)*6$#';

    try {
      const checkEmail = `SELECT * FROM users WHERE email=$1`;
      const value = [email];
      const returnedEmail = await pool.query(checkEmail, value);
      if (!returnedEmail.rows[0]) {
        const userSignupQuery = `INSERT INTO users (email, first_name, last_name, admin, password)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [email, first_name, last_name, admin, password];
        const newUser = await pool.query(userSignupQuery, values);
        return res.send({
          data: newUser.rows[0],
        });
        // return res.status(201).json({
        //   status: 'success',
        //   code: 201,
        //   data: newUser.rows[0],
        // });
      } else if (returnedEmail.rows[0]['suspend_status'] === 'TRUE') {
        return res.status(400).json({
          status: 'bad request',
          message: 'user has been suspended',
        });
      }
    } catch (error) {
      res.status(400).json({
        status: 'Passport error',
        message: 'error' + error,
      });
    }
    // res.rsend()
  },
);

export default router;

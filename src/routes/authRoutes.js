// imported middle ware to check token
import checkToken from '../middlewares/auth';
import {Router} from 'express';
import Authentication from '../controllers/authController';
import socialAuth from "../controllers/socialauth.controller";
import "../services/passport";
import passport from "passport";


const router = Router();

router.post('/signup',  Authentication.signUp);
router.post('/login',  Authentication.login);
router.get('/login/google',   passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/google/callback', passport.authenticate('google', { failureRedirect: '/api/v1/auth/login' }),function async (req, res) {
    const user = req.session.passport.user._json;
            email = user.email;
            first_name= user.given_name;
            last_name = user.family_name;
            const userSignupQuery = `INSERT INTO users (email, first_name, last_name, phonenumber, admin, password)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`; 
    //  try {
    //      const checkEmail = `SELECT * FROM users WHERE email=$1`;
    //    const value = [email];
    //    const returnedEmail = await pool.query(checkEmail, value);
    //    if (!returnedEmail.rows[0]) {
    //     //  return res.status(400).json({
    //     //    status: 'bad request',
    //     //    message: 'incorrect email or password',
    //     //  });
    //    } else if (returnedEmail.rows[0]['suspend_status'] === 'TRUE') {
    //      return res.status(400).json({
    //        status: 'bad request',
    //        message: 'user has been suspended',
    //      });
    //    } 
         
    //  } catch (error) {
    //     res
    //     .status(400)
    //     .json({
    //       status: 'Passport error',
    //       message: 'error' + error,
    //     });
    //  }
    res.redirect('/profile');
  });

export default router;
import passport from "passport";

class SocialAuth {
  static googleAuth(req, res) {
    passport.authenticate('google', { scope: ['profile', 'email'] });
  }
  static async saveGoogleInfo() {
    passport.authenticate('google', { failureRedirect: '/api/v1/auth/login' }),function async (req, res) {
        console.log(req.session.passport)
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
      };
  }
}
export default SocialAuth

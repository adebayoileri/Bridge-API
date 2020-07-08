import passport from "passport";

const signInGoogle = async() =>{
  passport.authenticate('google', { scope: ['profile', 'email'] })
}


const saveInfo = async() => {
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/login' }), async(req, res) => {
    const user = req.session.passport.user._json;
            email = user.email;
            first_name= user.given_name;
            last_name = user.family_name;
            admin = false;
            password = await bcrypt.hash(process.env.PASSWORD_AUTH, genSalt(10));

     try {
         const checkEmail = `SELECT * FROM users WHERE email=$1`;
       const value = [email];
       const returnedEmail = await pool.query(checkEmail, value);
       if (!returnedEmail.rows[0]) {

        const userSignupQuery = `INSERT INTO users (email, first_name, last_name, admin, password)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`; 
        const values = [email, first_name, last_name, admin, password];
        const newUser = await pool.query(userSignupQuery, values);
        return res.status(201).json({
          status: "success",
          code: 201,
          data: newUser.rows[0]
        })


       } else if (returnedEmail.rows[0]['suspend_status'] === true) {
         return res.status(400).json({
           status: 'bad request',
           message: 'user has been suspended',
         });
       } 
         
     } catch (error) {
      return  res
        .status(400)
        .json({
          status: 'Passport error',
          message: 'error' + error,
        });
     }
    res.redirect('/profile');
  }
}

module.exports ={signInGoogle, saveInfo}
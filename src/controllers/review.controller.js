import pool from '../models/db';

class reviewControlller {
  static async reviewUser(req, res) {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;
    
    try {
      if (!rating || !review || !id) {
        return res.status(400).json({
          status: 'Forbidden',
          code: 400,
          message: 'All fields are required',
        });
      }

      const reviewUserQuery = `INSERT INTO reviews(rating, review, reviewer, reviewee) VALUES($1, $2, $3, $4) RETURNING *`;
      const values = [rating, review, userId, id];

      const newReview = await pool.query(reviewUserQuery, values);
      return res.status(201).json({
        status: 'success',
        message: 'Review successfully created',
        code: 201,
        data: newReview.rows[0],
      });
    } catch (error) {
      return  res.status(500).json({
        status: "failed",
        code: 500,
        message:  `Error occured ${error}`
    })
    }
  }
}
export default reviewControlller;

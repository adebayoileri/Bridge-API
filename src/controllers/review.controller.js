import pool from '../models/db';

class reviewControlller {
  static async reviewUser() {
    const { id } = req.params;
    const { rating, review } = req.body;
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
    } catch (error) {}
  }
}
export default reviewControlller;

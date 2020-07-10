import pool from '../models/db';
import idValidator from '../middlewares/idValidator';
import validateReviewUser from '../middlewares/reviewValidator';

class reviewControlller {
  static async reviewUser(req, res) {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const IdValidatorResponse = idValidator({id})
    if(IdValidatorResponse.error) return res.status(400).json({Error: `${IdValidatorResponse.error}`})
    
    const responseReviewValidation = validateReviewUser({rating, review});
    if(responseReviewValidation.error) return res.status(400).json({Error: `${responseReviewValidation.error}`})
    
    if(id == userId) return res.status(400).json({
          status: "bad request",
          code: 400,
          message: "You cannot review yourself"
    })
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

  static async getUserReview(req, res) {
    const { id } = req.params;

    const IdValidatorResponse = idValidator({id})
    if(IdValidatorResponse.error) return res.status(400).json({Error: `${IdValidatorResponse.error}`})
    
    try {
      if (!id) {
        return res.status(400).json({
          status: 'Forbidden',
          code: 400,
          message: 'All fields are required',
        });
      }

      const userReviewsQuery = `SELECT * FROM reviews WHERE reviewee=$1 ORDER BY createdat DESC`;
      const values = [id]
      const newReview = await pool.query(userReviewsQuery, values);
      return res.status(201).json({
        status: 'success',
        message: 'All Reviews',
        code: 200,
        data: newReview.rows[0] || 'no reviews'
      });
    } catch (error) {
      return  res.status(500).json({
        status: "failed",
        code: 500,
        message:  `Error occured ${error}`
    })
    }
  }


  static async getPersonalUserReview(req, res) {
    const { id } = req.user;

    try {
      if (!id) {
        return res.status(400).json({
          status: 'Forbidden',
          code: 400,
          message: 'All fields are required',
        });
      }

      const userReviewsQuery = `SELECT * FROM reviews WHERE reviewee=$1 ORDER BY createdat DESC`;
      const values = [id]
      const newReview = await pool.query(userReviewsQuery, values);
      return res.status(201).json({
        status: 'success',
        message: 'All Reviews',
        code: 200,
        data: newReview.rows[0] || 'no review'
      });
    } catch (error) {
      return  res.status(500).json({
        status: "failed",
        code: 500,
        message:  `Error occured ${error}`
    })
    }
  }

  static async getReviewsPosted(req, res) {
    const { id } = req.user;

    try {
      if (!id) {
        return res.status(400).json({
          status: 'Forbidden',
          code: 400,
          message: 'All fields are required',
        });
      }

      const userReviewsQuery = `SELECT * FROM reviews WHERE reviewer=$1 ORDER BY createdat DESC`;
      const values = [id]
      const newReview = await pool.query(userReviewsQuery, values);
      return res.status(201).json({
        status: 'success',
        message: 'All Reviews',
        code: 200,
        data: newReview.rows[0] || 'no review posted'
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

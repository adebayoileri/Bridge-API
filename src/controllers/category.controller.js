import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../models/db';
dotenv.config();

class categoryController {
  /**
   *  @description   Get tasks for all authenticated users
   *  @param { object } - request [start -> number of page] [count -> number of category to return]
   *  @param query - /v1/category?page=0&limit=10
   *  @returns { object } - all category in db
   **/

  static async getAllCategory(req, res) {

    const{ start , count} = req.query;

    jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=> {
        if(err){
            return res.status(403).json({
                status: 'jwt error',
                code: 403,
                message: err
            })
        }else{
            if(!req.query || !start || !count) return res.status(400).json({
              status: 'failed',
              code: 400,
              message: 'query [start, count] are needed to fetch categories'
            })
        
            try {
              const getAllTaskQuery = `SELECT * FROM categories ORDER BY createdat OFFSET($1) LIMIT($2)`;
              const values = [start, count]
              const allCategory = await pool.query(getAllTaskQuery, values);
              return res.status(200).json({
                  status: 'success',
                  code: 200,
                  message: 'get all category sucessfully',
                  data: allCategory.rows,
              });
            } catch (error) {
              res.status(500).json({
                message: ' Error from server' + error,
              });
            }
        }
    })
  }

  /**
   * @description - Get a single category with an authenticated user
   * @param {object} req - request object recieved
   * @param {object} res - response object sent
   * @returns {object} -specific category
   */

  static async getSingleCategory(req, res) {
    const { id } = req.params;

    jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData) => {
        if(err){
            return res.status(403).json({
                status: 'failed',
                code: 403,
                message: err
            })
        }else{
            try {
              const getSingleTaskQuery = `SELECT * FROM categories WHERE id=$1`;
              const values = [id];
              const singleCategory = await pool.query(getSingleTaskQuery, values);
              if(!singleCategory.rows[0]){
                return res.status(400).json({
                    status: "failed",
                    code: 400,
                    message: "Category doesn\'t exists in db"
                })
            }
              return res.status(200).json({
                  status: 'success',
                  code: 200,
                  message: `category with id ${id} successfully`,
                  data: singleCategory.rows[0],
              });
            } catch (error) {
              return res.status(500).json({
                message: 'Error occured' + error,
                code: 500,
                status: failed,
              });
            }
        }})
  }

  /**
   * @description Create a category for authenticated user
   * @param {object} req - the request object request
   * @param { object} res - the response object sent
   * @returns {object} - the new category created
   **/
  static async createNewCategory(req, res) {
    const { slug, name } = req.body;

    jwt.verify(req.token, process.env.AUTHKEY, async(err, authorizedData)=> {
        if(err){
            return res.status(403).json({
                status: 'jwt error',
                code: 403,
                message: err
            })
        }else{

            try {
              if (!slug || !name ) {
                return res.status(400).json({
                  message: 'All fields are required',
                });
              }
        
              const createCategoryQuery = `INSERT INTO categories (slug, name) VALUES($1, $2) RETURNING *`;
              const values = [slug, name];
              const newCategory = await pool.query(createCategoryQuery, values);
              return res.status(201).json({
                  status: 'success',
                  code: 201,
                  message: 'category successfully created',
                  data: newCategory.rows[0],
              });
            } catch (error) {
              return res.status(500).json({
                message: 'Server Error' + error,
              });
            }
        }})
}

 /**
  * @description - Update a specific category for authenticated users
  * @param {object} req - request object recieved
  * @param {object} res - response object sent
  *  @returns {object} - category upadted
  */

  static async updateCategory(req, res) {
    const { id } = req.params;
    const { slug, name } = req.body;
    jwt.verify(req.token, process.env.AUTHKEY, async(err, authorizedData)=> {
        if(err){
            return res.status(403).json({
                status: 'jwt error',
                code: 403,
                message: err
            })
        }else{
            try {
                if ( !slug || !name ) {
                    return res.status(400).json({
                      message: 'All fields are required',
                    });
                  }
              const checkCategoryQuery = `SELECT * from categories WHERE id=$1`
              const checkIdValue = [id]
              const checkedCategory = await pool.query(checkCategoryQuery, checkIdValue);
              if(!checkedCategory.rows[0]){
                return res.status(400).json({
                    status: "failed",
                    code: 400,
                    message: "Category doesn\'t exists in db"
                })
            }
              const updateCategoryQuery = `UPDATE categories SET slug = $1, name = $2, updatedat=CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`;
              const values = [slug, name, id];
              const updatedCategory= await pool.query(updateCategoryQuery, values);
              return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'category updated successfully',
                data: updatedCategory.rows[0],
              });
            } catch (error) {
                console.log(error)
              res.status({
                message: 'Server error' + error,
                status: 'failed',
                code: 500,
              });
            }
        }})
  }

  /**
   * @description - delete a specific category
   * @param { object } req - request object recieved
   * @param { object } res - response object sent
   */
  static async deleteCategory(req, res) {
    const {id} = req.params;
    jwt.verify(req.token, process.env.AUTHKEY, async(err, authorizedData)=> {
        if(err){
            return res.status(403).json({
                status: 'jwt error',
                code: 403,
                message: err
            })
        }else{
            try {
                const checkCategoryQuery = `SELECT * from categories WHERE id=$1`
                const checkIdValue = [id]
                const checkedCategory = await pool.query(checkCategoryQuery, checkIdValue);
                if(!checkedCategory.rows[0]){
                  return res.status(400).json({
                      status: "failed",
                      code: 400,
                      message: `Category with id ${id} doesn\'t exists in db`
                  })
                }
                const deleteCategoryQuery =`DELETE FROM categories WHERE id = $1`;
                const value = [id];
                    await pool.query(deleteCategoryQuery, value);
                return res.status(200).json({
                    status:"sucess",
                    code: 200,
                    message: `Category with id ${id} deleted`,
                });
        
            } catch (error) {
                res.status(500).json({
                    status: "failed",
                    code: 500,
                    message:  `Error occured ${error}`
                })
            }
        }})
    }
}

export default categoryController;

import { config } from 'dotenv';
import pool from '../models/db';
class taskController {
  /**
   *  @description   Get tasks for all authenticated users
   *  @param { object } - request object recieved
   *  @param { object } - response object sent
   *  @returns { object } - all tasks in db
   **/
  static async getAllTasks(req, res) {
    try {
      const getAllTaskQuery = `SELECT * FROM tasks`;
      const allTasks = await pool.query(getAllTaskQuery);
      return res.status(200).json({
          status: 'success',
          code: 200,
        message: 'get all tasks sucessfully',
        data: allTasks.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: ' Error from server' + error,
      });
    }
  }

  /**
   * @description - Get a single task with an authenticated user
   * @param {object} req - request object recieved
   * @param {object} res - response object sent
   * @returns {object} -specific task
   */

  static async getSingleTask(req, res) {
    const { id } = req.params;
    try {
      const getSingleTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const values = [id];
      const singleTask = await pool.query(getSingleTaskQuery, values);
      return res.status(200).json({
          status: 'success',
          code: 200,
        message: `get task with id ${id} successfully`,
        data: singleTask.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured' + error,
        code: 500,
        status: failed,
      });
    }
  }

  /**
   * @description Create a task for authenticated user
   * @param {object} req - the request object request
   * @param { object} res - the response object sent
   * @returns {object} - the new task created
   **/
  static async createNewTask(req, res) {
    const {
      title,
      bannerImg,
      category,
      description,
      user_id,
      category_id,
      location,
      minbudget,
      maxbudget,
      startdate,
      enddate,
    } = req.body;

    try {
      if (
        !title ||
        !bannerImg ||
        !category ||
        !description ||
        !user_id ||
        !category_id ||
        !minbudget ||
        !maxbudget ||
        !startdate ||
        !enddate
      ) {
        return res.status(400).json({
          message: 'All fields are required',
        });
      }

      const createTaskQuery = `INSERT INTO tasks (title, bannerImg, category, description, user_id, category_id, status,location, minbudget, maxbudget, startdate, enddate) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
      const values = [
        title,
        bannerImg,
        category,
        description,
        user_id,
        category_id,
        'pending',
        location || 'remote',
        minbudget,
        maxbudget,
        startdate,
        enddate,
      ];
      const newTask = await pool.query(createTaskQuery, values);
      return res.status(201).json({
          status: 'success',
          code:201,
        message: 'task successfully created',
        data: newTask.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server Error' + error,
      });
    }
  }
  static async updateTask(req, res) {
    const { id } = parseInt(req.params);
    const {
      title,
      bannerImg,
      category,
      description,
      category_id,
      location,
      minbudget,
      maxbudget,
      startdate,
      enddate,
    } = req.body;
    if (
        !title ||
        !bannerImg ||
        !category ||
        !description ||
        !category_id ||
        !minbudget ||
        !maxbudget ||
        !startdate ||
        !enddate
      ) {
        return res.status(400).json({
          message: 'All fields are required',
        });
      }

    try {
      const updateTaskQuery = `UPDATE tasks SET title = $1, bannerImg = $2, category = $3, description = $4, category_id = $5,location = $6, minbudget = $7, maxbudget = $8, startdate = $9, enddate = $10 WHERE id = $11 RETURNING id, title;`;
      const values = [
        title,
        bannerImg,
        category,
        description,
        category_id,
        location,
        minbudget,
        maxbudget,
        startdate,
        enddate,
        id,
      ];
      const updatedTask = await pool.query(updateTaskQuery, values);
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'task updated succesfully',
        data: updatedTask.rows[0],
      });
    } catch (error) {
      res.status({
        message: 'Server error' + error,
        status: 'failed',
        code: 500,
      });
    }
  }
  static async deleteTask(req, res) {
    const {id} = req.params;
    try {
        const deleteTaskQuery =`DELETE FROM tasks WHERE id = $1`;
        const value = [id];
         await pool.query(deleteTaskQuery, value);
        return res.status(200).json({
         status:"sucess",
         code: 200,
          message: 'Task with id deleted',
        });

    } catch (error) {
        res.status(500).json({
            status: "failed",
            code: 500,
            message:  `Error occured ${error}`
        })
    }


  }
  static applyTask(req, res) {
    res.status(200).json({
      message: 'Application Success',
    });
  }
}

export default taskController;

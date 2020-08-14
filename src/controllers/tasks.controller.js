import dotenv from 'dotenv';
import pool from '../models/db';
import queryValidator from '../middlewares/queryValidator';
import idValidator from '../middlewares/idValidator';
import {
  validateCreateNewTask,
  validateUpdateTask,
  searchTask,
  filterTask,
} from '../middlewares/taskValidator';
import EmailSender from '../services/emailSender';

dotenv.config();
class taskController {
  /**
   *  @description   Get tasks for all authenticated users
   *  @param { object } - request [start -> number of page] [count -> number of tasks to return]
   *  @param query - /v1/tasks?start=0&count=20 default start=0&count=20
   *  @returns { object } - all tasks in db
   **/
  static async getAllTasks(req, res) {
    const start = req.query.start || 0;
    const count = req.query.count || 20;

    const responseValidation = queryValidator({ start, count });
    if (responseValidation.error)
      return res.status(400).json({ Error: `${responseValidation.error}` });

    try {
      const getAllTaskQuery = `SELECT * FROM tasks ORDER BY createdat DESC OFFSET($1) LIMIT($2)`;
      const values = [start, count];
      const allTasks = await pool.query(getAllTaskQuery, values);
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'get all tasks sucessfully',
        data: allTasks.rows
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
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

    const responseValidation = idValidator({ id });
    if (responseValidation.error)
      return res.status(400).json({ Error: `${responseValidation.error}` });
    try {
      const getSingleTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const values = [id];
      const singleTask = await pool.query(getSingleTaskQuery, values);
      if (!singleTask.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: "Task doesn't exists in db",
        });
      }
      if(singleTask.rows[0]){
        const getUserQuery = `SELECT * FROM users WHERE id=$1`;
        const posterId = singleTask.rows[0].user_id;
        const value = [posterId];
        const userInfo = await pool.query(getUserQuery, value);
        // delete userInfo.rows[0].email;
        delete userInfo.rows[0].phonenumber;
        delete userInfo.rows[0].password;
        return res.status(200).json({
          status: 'success',
          code: 200,
          message: `get task with id ${id} successfully`,
          data: singleTask.rows[0],
          user: userInfo.rows[0]
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured' + error,
        code: 500,
        status: "failed",
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
      // category_id,
      jobtype,
      pricetype,
      fixedprice,
      location,
      minbudget,
      maxbudget,
      startdate,
      enddate,
    } = req.body;

    const user_id = req.user.id;

    try {
      if (
        !title ||
        // !bannerImg ||
        !category ||
        !description ||
        !user_id ||
        // !category_id ||
        !jobtype ||
        !pricetype ||
        !location ||
        !startdate ||
        !enddate ||
        !user_id
      ) {
        return res.status(400).json({
          message: 'All fields are required',
        });
      }
      
      const responseValidation = validateCreateNewTask({
        title,
        bannerImg ,
        category,
        description,
        user_id,
        // category_id,
        jobtype,
        pricetype,
        fixedprice,
        location,
        minbudget,
        maxbudget,
        startdate,
        enddate,
      });
      if (responseValidation.error)
        return res.status(400).json({ Error: `${responseValidation.error}` });
      const createTaskQuery = `INSERT INTO tasks (title, bannerImg, category, description, user_id,  jobtype, pricetype, fixedprice, status,location, minbudget, maxbudget, startdate, enddate, createdat) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;
      const values = [
        title,
        bannerImg,
        category,
        description,
        user_id,
        // category_id,
        jobtype,
        pricetype,
        fixedprice,
        'pending',
        location || 'lagos',
        minbudget,
        maxbudget,
        startdate,
        enddate,
        new Date()
      ];
      const newTask = await pool.query(createTaskQuery, values);
      return res.status(201).json({
        status: 'success',
        code: 201,
        message: 'task successfully created',
        data: newTask.rows[0],
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: 'Server Error' + error,
      });
    }
  }
  /**
   * @description - Update a specific task
   * @param {object} req - request object recieved
   * @param {object} res - response object sent
   *  @returns {object} - Task upadted
   */

  static async updateTask(req, res) {
    const { id } = req.params;
    const user_id = req.user.id;

    const {
      title,
      bannerImg,
      category,
      description,
      // category_id,
      location,
      minbudget,
      maxbudget,
      startdate,
      enddate,
    } = req.body;

    const responseIdValidation = idValidator({ id });
    if (responseIdValidation.error)
      return res.status(400).json({ Error: responseIdValidation.error });
    const responseBodyValidation = validateUpdateTask({
      title,
      bannerImg,
      category,
      description,
      // category_id,
      location,
      minbudget,
      maxbudget,
      startdate,
      enddate,
    });
    if (responseBodyValidation.error)
      return res.status(400).json({ Error: responseBodyValidation.error });

    try {
      const getSingleTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const values = [id];
      const singleTask = await pool.query(getSingleTaskQuery, values);
      const TaskToUpdate = singleTask.rows[0];
      if (!singleTask.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: "Task doesn't exists in db",
        });
      }

      if (singleTask.rows[0].user_id === user_id) {
        const newTitle = title || TaskToUpdate.title;
        const newBannerImg = bannerImg || TaskToUpdate.bannerimg;
        const newCategory = category || TaskToUpdate.category;
        const newDescription = description || TaskToUpdate.description;
        // const newCategory_id = category_id || TaskToUpdate.category_id;
        const newLocation = location || TaskToUpdate.location;
        const newMinbudget = minbudget || TaskToUpdate.minbudget;
        const newMaxbudget = maxbudget || TaskToUpdate.maxbudget;
        const newStartdate = startdate || TaskToUpdate.startdate;
        const newEnddate = enddate || TaskToUpdate.enddate;
        const updateTaskQuery = `UPDATE tasks SET title = $1, bannerImg = $2, category = $3, description = $4,location = $5, minbudget = $6, maxbudget = $7, startdate = $8, enddate = $9, updatedat=CURRENT_TIMESTAMP WHERE id = $10 RETURNING *`;
        const valuesToUpdate = [
          newTitle,
          newBannerImg,
          newCategory,
          newDescription,
          // newCategory_id,
          newLocation,
          newMinbudget,
          newMaxbudget,
          newStartdate,
          newEnddate,
          id,
        ];
        const updatedTask = await pool.query(updateTaskQuery, valuesToUpdate);
        return res.status(200).json({
          status: 'success',
          code: 200,
          message: 'task updated succesfully',
          data: updatedTask.rows[0],
        });
      } else {
        return res.status(400).json({
          status: 'bad request',
          code: 400,
          message: 'Task is not owned by this user',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status({
        message: 'Server error' + error,
        status: 'failed',
        code: 500,
      });
    }
  }

  /**
   * @description - delete a specific task
   * @param { object } req - requesr object recieved
   * @param { object } res - response object sent
   */
  static async deleteTask(req, res) {
    const { id } = req.params;

    // id of the user that wants to delete the task
    const userId = req.user.id;

    const responseValidation = idValidator({ id });
    if (responseValidation.error)
      return res.status(400).json({ Error: `${responseValidation.error}` });

    try {
      const getSingleTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const values = [id];
      const singleTask = await pool.query(getSingleTaskQuery, values);
      if (!singleTask.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: "Task doesn't exists in db",
        });
      }
      if (singleTask.rows[0].user_id === userId) {
        const deleteTaskQuery = `DELETE FROM tasks WHERE id = $1`;
        const value = [id];
        await pool.query(deleteTaskQuery, value);
        return res.status(200).json({
          status: 'sucess',
          code: 200,
          message: 'Task with id deleted',
        });
      } else {
        return res.status(400).json({
          status: 'bad request',
          code: 400,
          message: 'Task is not owned by this user',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 'failed',
        code: 500,
        message: `Error occured ${error}`,
      });
    }
  }

  /**
   *  @description   Get tasks for all authenticated users
   *  @param  - request [start -> number of page] [count -> number of tasks to return] category, status
   *  @param query - /v1/tasks?start=0&category=pending&status=one-time
   *  @param default - default start=0, count=20, category=one-time, status=pending
   * @returns { object } - all tasks in db
   **/

  static async filterTask(req, res) {
    const status = req.query.status || 'pending';
    const category = req.query.category || 'one-time';
    const location = req.query.location || 'lagos';
    const minbudget = req.query.minBudget || 500;
    const maxbudget = req.query.maxbudget || 5000;
    const start = req.query.start || 0;
    const count = req.query.count || 20;

    const responseQueryValidation = queryValidator({ start, count });
    if (responseQueryValidation.error)
      return res
        .status(400)
        .json({ Error: `${responseQueryValidation.error}` });
    const responseFilterValidation = filterTask({ status, category, location });
    if (responseFilterValidation.error)
      return res
        .status(400)
        .json({ Error: `${responseFilterValidation.error}` });

    try {
      const getFilteredTaskQuery = `SELECT * FROM tasks
                                          WHERE location ILIKE $1 OR status ILIKE $2 OR category ILIKE $3 OR minbudget ILIKE $4 OR maxbudget ILIKE $5
                                          ORDER BY createdat DESC OFFSET($6) LIMIT($7)`;
      const values = [
        `%${location}%`,
        `%${status}%`,
        `%${category}%`,
        `%${minbudget}%`,
        `%${maxbudget}%`,
        start,
        count,
      ];
      const allFiltered = await pool.query(getFilteredTaskQuery, values);
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: `showing results for tasks with location - ${location}, status - ${status}, category - ${category}, min-budget ${minbudget} and ${maxbudget}`,
        data: allFiltered.rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: ' Error from server' + error,
      });
    }
  }


  static async searchTask(req, res) {
    const keyword = req.query.keyword || 'none';
    const start = req.query.start || 0;
    const count = req.query.count || 20;

    const responseQueryValidation = queryValidator({ start, count });
    if (responseQueryValidation.error)
      return res
        .status(400)
        .json({ Error: `${responseQueryValidation.error}` });
    const responsesearchValidation = searchTask({ keyword});
    if (responsesearchValidation.error)
      return res
        .status(400)
        .json({ Error: `${responsesearchValidation.error}` });

    try {
      const getFilteredTaskQuery = `SELECT * FROM tasks
                                          WHERE to_tsvector(tasks.title || ' ' || tasks.description || ' ' || tasks.location ) @@ plainto_tsquery($1)
                                          ORDER BY createdat DESC OFFSET($2) LIMIT($3)`;
      const values = [
        `${keyword}`,
        start,
        count,
      ];
      const allFiltered = await pool.query(getFilteredTaskQuery, values);
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: `Avaliable results`,
        data: allFiltered.rows,
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: ' Error from server' + error,
      });
    }
  }

  static  async applyTask(req, res) {
    const {taskId} = req.params;
    const applicantId = req.user.id;
    const applicantMail = req.user.email;
    const {
      posterId,
      posterEmail,
      posterName,
      taskDueDate,
      taskBudget,
      applicantName,
      proposal
    } = req.body;
    try{
      const getTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const taskValue = [taskId];
      const singleTask = await pool.query(getTaskQuery, taskValue);
      if (!singleTask.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: "Task doesn't exists in db",
        });
      }
      const getUserQuery = `SELECT * FROM task_user WHERE task_id = $1 AND applicant_id =$2 AND user_id=$3`;
      const theValue = [taskId, applicantId, posterId];
      const userTaskQuery = await pool.query(getUserQuery, theValue);
      if (userTaskQuery.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: 'user already applied for task',
        });
      }

      EmailSender.sendApplyJobEmail({posterEmail, posterName, taskTitle: singleTask.rows[0].title, taskDescription: singleTask.rows[0].description, taskDueDate, taskBudget, applicantName, applicantProposal: proposal, applicantMail})
      const applytaskQuery = `INSERT INTO task_user (proposal, applicant_id, task_id, user_id) VALUES($1, $2, $3, $4) RETURNING *`;
      const values = [proposal, applicantId, taskId, posterId];
      const appliedTask = await pool.query(applytaskQuery, values);

      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Application Success',
        data: appliedTask.rows[0],
      });
    } catch (err) {
      console.log('Error' + err);
    }
  }

    /**
   *  @description   Approve a task
   *  @param  - taskid , applicantId
   *  @param query - /v1/tasks/apply/:taskId
   * @returns { object } - apply for a task
   **/

  static async approveTask(req, res) {
    const { taskId } = req.params;
    const { applicantId } = req.body;
    try {
      const getTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const taskValue = [taskId];
      const singleTask = await pool.query(getTaskQuery, taskValue);
      if (!singleTask.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: "Task doesn't exists in db",
        });
      }
      const approvetaskQuery = `UPDATE task_user SET status = "approved" WHERE applicant_id = $1 AND task_id = $2 RETURNING *`;
      const values = [applicantId, taskId];
      const approvedTask = await pool.query(approvetaskQuery, values);

      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'successfully approved',
        data: approvedTask.rows[0],
      });
    } catch (err) {
      console.log('Error' + err);
    }
  }

  static async closeTask(req, res) {
    const { taskId } = req.params;
    const  posterId  = req.user.id;
    try {
      const getTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const taskValue = [taskId];
      const singleTask = await pool.query(getTaskQuery, taskValue);
      if (!singleTask.rows[0]) {
        return res.status(400).json({
          status: 'failed',
          code: 400,
          message: "Task doesn't exists in db",
        });
      }
      const closetaskQuery = `UPDATE tasks SET status = "closed" WHERE user_id = $1 AND task_id = $2 RETURNING *`;
      const values = [posterId, taskId];
      await pool.query(closetaskQuery, values);

      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'task closed',
      });
    } catch (err) {
      console.log('Error' + err);
    }
  }
}

export default taskController;

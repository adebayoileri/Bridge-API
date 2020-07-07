import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';
import pool from '../models/db';
import queryValidator from '../middlewares/queryValidator';
import idValidator from '../middlewares/idValidator';
import {validateCreateNewTask, validateUpdateTask, filterTask} from '../middlewares/taskValidator';

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

    const responseValidation = queryValidator({start, count})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

   jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=> {
      if(err){
          return res.status(403).json({
              status: 'jwt error',
              code: 403,
              message: err
          })
      }else{
        try {
          const getAllTaskQuery = `SELECT * FROM tasks ORDER BY createdat DESC OFFSET($1) LIMIT($2)`;
          const values = [start, count]
          const allTasks = await pool.query(getAllTaskQuery, values);
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
      }})
  }

  /**
   * @description - Get a single task with an authenticated user
   * @param {object} req - request object recieved
   * @param {object} res - response object sent
   * @returns {object} -specific task
   */

  static async getSingleTask(req, res) {
    const { id } = req.params;

    const responseValidation = idValidator({id})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

    jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=> {
      if(err){
          return res.status(403).json({
              status: 'jwt error',
              code: 403,
              message: err
          })
      }else{
        try {
          const getSingleTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
          const values = [id];
          const singleTask = await pool.query(getSingleTaskQuery, values);
          if(!singleTask.rows[0]){
            return res.status(400).json({
                status: "failed",
                code: 400,
                message: "Task doesn\'t exists in db"
            })
        }
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
      }})
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

    jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=> {
      if(err){
          return res.status(403).json({
              status: 'jwt error',
              code: 403,
              message: err
          })
      }else{
        try {
          if (
            !title ||
            !bannerImg ||
            !category ||
            !description ||
            !user_id ||
            !category_id ||
            !location ||
            !minbudget ||
            !maxbudget ||
            !startdate ||
            !enddate
          ) {
            return res.status(400).json({
              message: 'All fields are required',
            });
          }
    
          const responseValidation = validateCreateNewTask({title, bannerImg, category, description, user_id, category_id,location, minbudget, maxbudget, startdate, enddate})
          if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})
      
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
      }})
  }
 /**
  * @description - Update a specific task
  * @param {object} req - request object recieved
  * @param {object} res - response object sent
  *  @returns {object} - Task upadted
  */

  static async updateTask(req, res) {
    const { id } = req.params;
 
    const{
      title,
     bannerImg,
     category ,
     description ,
     category_id ,
     location ,
     minbudget,
     maxbudget ,
     startdate,
     enddate} = req.body;

     if (
      !title ||
      !bannerImg ||
      !category ||
      !description ||
      !category_id ||
      !minbudget ||
      !location ||
      !maxbudget ||
      !startdate ||
      !enddate
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const responseIdValidation = idValidator({id})
    if(responseIdValidation.error) return res.status(400).json({Error: responseIdValidation.error})
    const responseBodyValidation = validateUpdateTask({title, bannerImg, category, description, category_id, location, minbudget, maxbudget,startdate, enddate})
    if(responseBodyValidation.error) return res.status(400).json({Error: responseBodyValidation.error })

      jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=> {
        if(err){
            return res.status(403).json({
                status: 'jwt error',
                code: 403,
                message: err
            })
        }else{
          try {
            const getSingleTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
            const values = [id];
            const singleTask = await pool.query(getSingleTaskQuery, values);
            const TaskToUpdate = singleTask.rows[0];
            if(!singleTask.rows[0]){
              return res.status(400).json({
                  status: "failed",
                  code: 400,
                  message: "Task doesn\'t exists in db"
              })
           }
            const newTitle = title || TaskToUpdate.title;
            const newBannerImg = category || TaskToUpdate.bannerImg;
            const newCategory = picture || TaskToUpdate.category;
            const newDescription = description || TaskToUpdate.description;
            const newCategory_id = category_id || TaskToUpdate.category_id;
            const newLocation = location || TaskToUpdate.location;
            const newMinbudget = minbudget || TaskToUpdate.minbudget;
            const newMaxbudget = maxbdget || TaskToUpdate.maxbudget;
            const newStartdate = startdate || TaskToUpdate.startdate;
            const newEnddate = enddate || TaskToUpdate.enddate;
            const updateTaskQuery = `UPDATE tasks SET title = $1, bannerImg = $2, category = $3, description = $4, category_id = $5,location = $6, minbudget = $7, maxbudget = $8, startdate = $9, enddate = $10, updatedat=CURRENT_TIMESTAMP WHERE id = $11 RETURNING id, title`;
            const valuesToUpdate = [
              newTitle,
              newBannerImg,
              newCategory,
              newDescription,
              newCategory_id,
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
          } catch (error) {
            res.status({
              message: 'Server error' + error,
              status: 'failed',
              code: 500,
            });
          }
        }})
  }

  /**
   * @description - delete a specific task
   * @param { object } req - requesr object recieved
   * @param { object } res - response object sent
   */
  static async deleteTask(req, res) {
    const {id} = req.params;

    const responseValidation = idValidator({id})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

    jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=> {
      if(err){
          return res.status(403).json({
              status: 'jwt error',
              code: 403,
              message: err
          })
      }else{
        try {
          const getSingleTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
          const values = [parseInt(id)];
          const singleTask = await pool.query(getSingleTaskQuery, values);
              if(!singleTask.rows[0]){
                return res.status(400).json({
                    status: "failed",
                    code: 400,
                    message: "Task doesn\'t exists in db"
                })
            }
            const deleteTaskQuery =`DELETE FROM tasks WHERE id = $1`;
            const value = [parseInt(id)];
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
      }})
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
    const start = req.query.start || 0;
    const count = req.query.count || 20;

    const responseQueryValidation = queryValidator({start, count});
    if(responseQueryValidation.error) return res.status(400).json({Error: `${responseQueryValidation.error}`})
    const responseFilterValidation = filterTask({status, category});
    if(responseFilterValidation.error) return res.status(400).json({Error: `${responseFilterValidation.error}`})

    jwt.verify(req.token, process.env.AUTHKEY, async (err, authorizedData)=> {
      if(err){
          return res.status(403).json({
              status: 'jwt error',
              code: 403,
              message: err
          })
      }else{
        try {
          const getFilteredTaskQuery = `SELECT * FROM tasks
                                          WHERE status=$1 AND category=$2
                                          ORDER BY createdat DESC OFFSET($3) LIMIT($4)`;
          const values = [status,category, start, count];
          const allFiltered = await pool.query(getFilteredTaskQuery, values);
          return res.status(200).json({
              status: 'success',
              code: 200,
              message: `showing results for tasks with status - ${status} and category - ${category}`,
              data: allFiltered.rows,
          });
        } catch (error) {
          res.status(500).json({
            message: ' Error from server' + error,
          });
        }
      }})
  }

  static  async applyTask(req, res) {
    const {taskId} = req.params;
    const {
      proposal,
      applicantId,
      posterId
    } = req.body;
    try{
      const getTaskQuery = `SELECT * FROM tasks WHERE id = $1`;
      const taskValue = [taskId];
      const singleTask = await pool.query(getTaskQuery, taskValue);
      if(!singleTask.rows[0]){
        return res.status(400).json({
            status: "failed",
            code: 400,
            message: "Task doesn\'t exists in db"
        })
     }
     const getUserQuery = `SELECT * FROM task_user WHERE taskId = $1 AND applicant_id =$2`;
     const theValue = [taskId, applicantId];
     const userTaskQuery = await pool.query(getUserQuery, theValue);
     if(userTaskQuery.rows[0]){
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "user already applied for task"
    })
     }
      const applytaskQuery = `INSERT INTO task_user (proposal, applicant_id, task_id, user_id) VALUES($1, $2, $3, $4) RETURNING *`;
      const values = [
        proposal,
        applicantId,
        taskId,
        posterId
      ];
      const appliedTask = await pool.query(applytaskQuery, values)

     return res.status(200).json({
       status: "success",
       code: 200,
      message: "Application Success",
      data: appliedTask.rows[0]
      });
    }catch(err){

    }

  }
}

export default taskController;

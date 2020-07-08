import dotenv from 'dotenv';
import pool from '../models/db';
import idValidator from '../middlewares/idValidator';
import queryValidator from '../middlewares/queryValidator';
dotenv.config();

class adminController {

  static async getAllTasks(req, res) {
    const start = req.query.start || 0;
    const count = req.query.count || 20;

    const responseValidation = queryValidator({start, count})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

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
          return res.status(500).json({
            message: ' Error from server' + error,
          });
        }
  }

    static async getAdminProfile(req, res){
        const {email} = req.admin;
        try {
            const getUserQuery = `SELECT * FROM users WHERE email=$1`;
            const value = [email];
            const userData = await pool.query(getUserQuery, value);
            if(userData.rows[0]){
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: {
                        id : userData.rows[0].id,
                        first_name: userData.rows[0].first_name,
                        last_name : userData.rows[0].last_name,
                        phonenumber: userData.rows[0].phonenumber,
                        admin : userData.rows[0].admin,
                        createdat: userData.rows[0].createdat,
                        updatedat: userData.rows[0].updatedat,
                        pro : userData.rows[0].pro,
                        suspend_status : userData.rows[0].suspend_status,
                        email_verified : userData.rows[0].email_verified,
                        auth_id : userData.rows[0].auth_id,
                        auth_provider : userData.rows[0].auth_provider,
                        gender_id: userData.rows[0].gender_id
                    }
                })
            }else{
                return res.status(404).json({
                    status: "error",
                    code: 404,
                    message: "admin does not exist"
                })
            }
        } catch (err) {
            console.log('Error'+ err)
        }
    }

  /**
   *  @description   Get users for all admin users
   *  @returns { object } - all user count
   **/

  static async getAllusersCount(req, res) {
            try {
              const getAllusersCountQuery = `SELECT COUNT(*) FROM users`;
              const allusersCount = await pool.query(getAllusersCountQuery);
              return res.status(200).json({
                  status: 'success',
                  code: 200,
                  message: 'all current users count',
                  data: allusersCount.rows[0]
              });
            } catch (error) {
              res.status(500).json({
                message: ' Error from server' + error,
              });
            }
  }


  static async getallTasksCount(req, res) {
            try {
              const getTaskCount = `SELECT COUNT(*) FROM tasks`;
              const count = await pool.query(getTaskCount);

              return res.status(200).json({
                  status: 'success',
                  code: 200,
                  message: `all tasks count`,
                  data: count.rows[0],
              });
            } catch (error) {
              return res.status(500).json({
                message: 'Error occured' + error,
                code: 500,
                status: failed,
              });
            }
  }


  static async deleteTask(req, res) {
    const { id } = req.params;

            try {
              if (!id ) {
                return res.status(400).json({
                  message: 'All fields are required',
                });
              }

              const responseValidation = idValidator({id})
              if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

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
                  const deleteTaskQuery =`DELETE FROM tasks WHERE id = $1`;
                  const value = [id];
                   await pool.query(deleteTaskQuery, value);
                  return res.status(200).json({
                    status:"sucess",
                    code: 200,
                    message: `Task with id ${id} deleted`,
                  });

            } catch (error) {
              return res.status(500).json({
                message: 'Server Error' + error,
              });
            }
}

  static async suspendUser(req, res) {
    const { id } = req.params;

    const responseValidation = idValidator({id})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})
         try {
                if ( !id ) {
                    return res.status(400).json({
                      message: 'All fields are required',
                    });
                  }

              const checkUserQuery = `SELECT * from users WHERE id=$1`
              const checkIdValue = [id]
              const checkedUser = await pool.query(checkUserQuery, checkIdValue);
              if(!checkedUser.rows[0]){
                return res.status(400).json({
                    status: "failed",
                    code: 400,
                    message: "user doesn\'t exists in db"
                })
              }
                else if(checkedUser.rows[0].suspend_status === true){
                    return res.status(200).json({
                        status: 'bad request',
                        code: 400,
                        message: 'user has already been suspended',
                    })
                }else{
                    const suspendUserQuery = `UPDATE users SET suspend_status = $1 WHERE id = $2 RETURNING *`;
                    const values = [true, id];
                    const suspendedUser = await pool.query(suspendUserQuery, values);
                    return res.status(200).json({
                        status: 'success',
                        code: 200,
                        message: 'user suspended successfully',
                        data: suspendedUser.rows[0],
                    })
                 };
            } catch (error) {
              return res.status({
                message: 'Server error' + error,
                status: 'failed',
                code: 500,
              });
            }
}


static async UnSuspendUser(req, res) {
    const { id } = req.params;

    const responseValidation = idValidator({id})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

         try {
                if ( !id ) {
                    return res.status(400).json({
                      message: 'All fields are required',
                    });
                  }

              const checkUserQuery = `SELECT * from users WHERE id=$1`
              const checkIdValue = [id]
              const checkedUser = await pool.query(checkUserQuery, checkIdValue);
              if(!checkedUser.rows[0]){
                return res.status(400).json({
                    status: "failed",
                    code: 400,
                    message: "user doesn\'t exists in db"
                })
              }
                else if(checkedUser.rows[0].suspend_status === false){
                    return res.status(200).json({
                        status: 'bad request',
                        code: 400,
                        message: 'user is not suspended',
                    })
                }else{
                    const unSuspendUserQuery = `UPDATE users SET suspend_status = $1 WHERE id = $2 RETURNING *`;
                    const values = [false, id];
                    const suspendedUser = await pool.query(unSuspendUserQuery, values);
                    return res.status(200).json({
                        status: 'success',
                        code: 200,
                        message: 'user unsuspended successfully',
                        data: suspendedUser.rows[0],
                    })
                 };
            } catch (error) {
              return res.status({
                message: 'Server error' + error,
                status: 'failed',
                code: 500,
              });
            }
  }


  static async getSingleUser(req, res){
    const {id} = req.params;
    try {
        const getUserQuery = `SELECT * FROM users WHERE id=$1`;
        const value = [id];
        const userData = await pool.query(getUserQuery, value);
        if(userData.rows[0]){
            return res.status(200).json({
                status: "success",
                code: 200,
                data: {
                    id : userData.rows[0].id,
                    first_name: userData.rows[0].first_name,
                    last_name : userData.rows[0].last_name,
                    phonenumber: userData.rows[0].phonenumber,
                    admin : userData.rows[0].admin,
                    createdat: userData.rows[0].createdat,
                    updatedat: userData.rows[0].updatedat,
                    pro : userData.rows[0].pro,
                    suspend_status : userData.rows[0].suspend_status,
                    email_verified : userData.rows[0].email_verified,
                    auth_id : userData.rows[0].auth_id,
                    auth_provider : userData.rows[0].auth_provider,
                    gender_id: userData.rows[0].gender_id
                }
            })
        }else{
            return res.status(404).json({
                status: "error",
                code: 404,
                message: "user does not exist"
            })
        }
    } catch (err) {
        console.log('Error'+ err)
    }
}


static async getAllUsers(req, res) {
    const start = req.query.start || 0;
    const count = req.query.count || 20;

    const responseValidation = queryValidator({start, count})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

        try {
          const getAllUsersQuery = `SELECT * FROM users WHERE admin = false ORDER BY createdat DESC OFFSET($1) LIMIT($2)`;
          const values = [start, count]
          const allUsers = await pool.query(getAllUsersQuery, values);
          return res.status(200).json({
              status: 'success',
              code: 200,
              message: 'get all users sucessfully',
              data: allUsers.rows,
          });
        } catch (error) {
          return res.status(500).json({
            message: ' Error from server' + error,
          });
        }
  }

  static async getAllAdmin(req, res) {
    const start = req.query.start || 0;
    const count = req.query.count || 20;

    const responseValidation = queryValidator({start, count})
    if(responseValidation.error) return res.status(400).json({Error: `${responseValidation.error}`})

        try {
          const getAllAdminsQuery = `SELECT * FROM users WHERE admin = true ORDER BY createdat DESC OFFSET($1) LIMIT($2)`;
          const values = [start, count]
          const allAdmins = await pool.query(getAllAdminsQuery, values);
          return res.status(200).json({
              status: 'success',
              code: 200,
              message: 'get all admins sucessfully',
              data: allAdmins.rows,
          });
        } catch (error) {
          return res.status(500).json({
            message: ' Error from server' + error,
          });
        }
  }
}

export default adminController;

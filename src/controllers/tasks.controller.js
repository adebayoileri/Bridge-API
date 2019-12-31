import {config} from 'dotenv';
class taskController {
    static getAllTasks(req, res){
        res.status(200).json({
            "message":"All task available"
        })
    }
    static getSingleTask(req, res){
        res.status(200).json({
            "message":"A single task available"
        })
    }
    static createNewTask(req, res){
        res.status(201).json({
            "message":"New task created"
        })
    }
    static updateTask(req, res){
        res.status(200).json({
            "message":"Update task"
        })
    }
    static deleteTask(req, res){
        res.status(200).json({
            "message":"Task with id deleted"
        })
    }
}

export default taskController;
const TaskModel = require("../Models/TaskModel");


const createTask = async (req,res) =>{
    const data = req.body;
    try{
        const model = new TaskModel(data);
        await model.save();
        res.status(201)
            .json({message:'Task is Created', success:true});
    }catch(err){
        res.status(500).json({message:'Failed to create task', success: false});
    }
}
const fetchAllTasks = async (req,res) =>{
    try{
        const data = await TaskModel.find({});
        res.status(200)
            .json({message:'All Tasks', success:true, data});
    }catch(err){
        res.status(500).json({message:'Failed to get all tasks', success: false});
    }
}
const UpdateTaskById = async (req,res) =>{
    try{
        const id = req.params.id;
        const body = req.body();
        const obj = { $set: {...body} };
        await TaskModel.findByIdAndUpdate(id,obj);
        res.status(200)
            .json({message:'Task Updated', success:true});
    }catch(err){
        res.status(500).json({message:'Failed to update task', success: false});
    }
}
const deleteTaskbyId = async (req,res) =>{
    const id = req.params.id;
    await TaskModel.findByIdAndDelete(id);
    try{
        res.status(200)
            .json({message:'Task deleted', success:true});
    }catch(err){
        res.status(500).json({message:'Failed to delete task', success: false});
    }
}
module.exports={
    createTask,
    fetchAllTasks,
    UpdateTaskById,
    deleteTaskbyId
}
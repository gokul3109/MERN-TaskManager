const { createTask, fetchAllTasks, UpdateTaskById, deleteTaskbyId } = require('../Controllers/TaskController');

const router = require('express').Router();

router.get('/',fetchAllTasks);

router.post('/',createTask);

router.put('/:id',UpdateTaskById);

router.delete('/:id',deleteTaskbyId);

module.exports = router;
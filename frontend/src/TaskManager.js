import React, { useEffect, useState } from 'react';
import { FaCheck, FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { notify } from './utils';
import { ToastContainer } from 'react-toastify';
import { createTask, DeleteTask, getAllTasks, UpdateTaskById } from './api';

function TaskManager() {
    const [input, setInput] = useState('');
    const [description, setDescription] = useState(''); // State for task description
    const [tasks, setTasks] = useState([]);
    const [copyTasks, setCopyTasks] = useState([]);
    const [updateTask, setUpdateTask] = useState(null);

    const handleTask = () => {
        if (updateTask && input) {
            console.log('update');
            const obj = {
                taskName: input,
                description, // Include description
                isDone: updateTask.isDone,
                _id: updateTask._id
            }
            handleUpdateItem(obj);
        } else if (updateTask === null && input) {
            handleAddTask();
            console.log('add');
        }
    };

    useEffect(() => {
        if (updateTask) {
            setInput(updateTask.taskName);
            setDescription(updateTask.description); // Set description for editing
        }
    }, [updateTask]);

    const handleAddTask = async () => {
        const obj = {
            taskName: input,
            description, // Include description
            isDone: false
        }
        try {
            const { success, message } = await createTask(obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            setInput('');
            setDescription(''); // Clear description after adding
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to create task', 'error');
        }
    };

    const fetchAllTasks = async () => {
        try {
            const { data } = await getAllTasks();
            setTasks(data);
            setCopyTasks(data);
        } catch (err) {
            console.error(err);
            notify('Failed to fetch tasks', 'error');
        }
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const handleDeleteTask = async (id) => {
        try {
            const { success, message } = await DeleteTask(id);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to delete task', 'error');
        }
    };

    const handleCheck = async (item) => {
        const { _id, isDone, taskName, description } = item;
        const obj = {
            taskName,
            description, // Keep the description unchanged
            isDone: !isDone
        }
        try {
            const { success, message } = await UpdateTaskById(_id, obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to update task', 'error');
        }
    };

    const handleUpdateItem = async (item) => {
        const { _id, isDone, taskName, description } = item;
        const obj = {
            taskName,
            description, // Update the description
            isDone
        }
        try {
            const { success, message } = await UpdateTaskById(_id, obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to update task', 'error');
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        const oldTask = [...copyTasks];
        const results = oldTask.filter((item) => item.taskName.toLowerCase().includes(term));
        setTasks(results);
    };

    return (
        <div className='flex flex-col items-center w-50 m-auto mt-5'>
            <h1 className='mb-4'>Task Manager</h1>

            {/* Input and search box */}
            <div className='flex justify-between items-center mb-4 w-100'>
                <div className="flex flex-grow mr-2">
                    <input
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 mr-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder='Add a new Task'
                    />
                    <input
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} // Handle description input
                        className="border border-gray-300 rounded-md p-2 mr-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder='Add a Task Description'
                    />
                    <button
                        onClick={handleTask}
                        className="bg-green-500 text-white rounded-md px-2 py-1 mr-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <FaPlus className='m-2' />
                    </button>
                </div>
                <div className='flex flex-grow'>
                    <span className="bg-slate-500 text-white rounded-md px-2 mr-1">
                        <FaSearch className='m-2' />
                    </span>
                    <input
                        onChange={handleSearch}
                        type='text'
                        className="border border-gray-300 rounded-md p-2 mr-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder='Search tasks'
                    />
                </div>
            </div>

            {/* List of tasks */}
            <div className='flex flex-col w-full'>
                {
                    tasks.map((item) => (
                        <div key={item._id} className='m-2 p-2 border bg-gray-100 w-full rounded-3 flex justify-between align-middle'>
                            <div className='flex flex-col'>
                                <span className={`font-bold ${item.isDone ? 'line-through' : ''}`}>
                                    {item.taskName}
                                </span>
                                <span className='text-gray-600'>{item.description}</span> 
                            </div>
                            <div className=''>
                                <button type='button' onClick={() => handleCheck(item)} className="bg-green-500 text-white text-sm p-2 rounded-md mr-2 hover:bg-green-600">
                                    <FaCheck />
                                </button>

                                <button type='button' onClick={() => setUpdateTask(item)} className="bg-blue-500 text-white text-sm p-2 rounded-md mr-2 hover:bg-blue-600">
                                    <FaPencilAlt />
                                </button>

                                <button type='button' onClick={() => handleDeleteTask(item._id)} className="bg-red-600 text-white text-sm p-2 rounded-md mr-2 hover:bg-red-700">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            <ToastContainer
                position='top-right'
                autoclose={3000}
                hideProgressBar={false}
            />
        </div>
    );
}

export default TaskManager;

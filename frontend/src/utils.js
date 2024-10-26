import {toast} from 'react-toastify'
export const notify = (message, type)=>{
    toast[type](message);
}
export const API_URL = 'https://mern-task-manager-api.vercel.app';

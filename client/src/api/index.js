import axios from 'axios'

const url = 'http://localhost:5000/';
axios.defaults.withCredentials = true;

export const login = (user) => {
    return axios.post(`${url}login`, user)
}

export const logout = () => {
    return axios.get(`${url}logout`)
}

export const coursesTaken = () => {
    return axios.get(`${url}coursesTaken`)
}

export const getUser = () => {
    return axios.get(`${url}getUser`)
}

export const getRunningCourses = () => {
    return axios.get(`${url}getRunningCourses`)
}

export const getRunningCourse = (department) => {
    return axios.post(`${url}getRunningCourse`,department)
}

export const getCourse = (courseid) => {
    return axios.post(`${url}getCourse`,courseid)
}

export const getInstructor = (instid) => {
    return axios.post(`${url}getInstructor`, instid)
}

export const getAllRunningCourses = () => {
    return axios.get(`${url}getAllRunningCourses`)
}

export const registerCourses = (data) => {
    return axios.patch(`${url}register`, data)
}

export const dropCourses = (data) => {
    return axios.patch(`${url}drop`, data)
}
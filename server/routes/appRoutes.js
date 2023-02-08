import express from 'express';
import { handleLogin, handleLogout, coursesTaken , getUser , getRunningCourses , getRunningCourse , getCourse , getInstructor} from '../controllers/appControllers.js';
import { getAllRunningCourses,registerCourses,dropCourses } from '../controllers/appControllers.js';
const router = express.Router();

router.post('/login', handleLogin);
router.get('/logout', handleLogout);
router.get('/coursesTaken', coursesTaken);
router.get('/getUser', getUser);
router.get('/getRunningCourses', getRunningCourses)
router.post('/getRunningCourse', getRunningCourse)
router.post('/getCourse', getCourse)
router.post('/getInstructor', getInstructor)
router.get('/getAllRunningCourses', getAllRunningCourses)
router.patch('/register', registerCourses)
router.patch('/drop', dropCourses)

export default router;

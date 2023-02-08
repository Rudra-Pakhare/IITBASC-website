import './App.css';
import LoginPage from './components/login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './components/dashboard/dashboard';
import HomePage from './components/home/home';
import Registration from './components/registration/registration';
import Course from './components/courses/course';
import RunningCourses from './components/running_courses/running_courses';
import RunningCourse from './components/running_courses/running_course/running_course';
import Instructor from './components/instructor/instructor';
import ErrorPage from './ErrorPage';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {
  const [user, setUser] = useState({});

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route element={<Dashboard/>}>
            <Route path="/home" element={<HomePage/>} />
            <Route path="/home/registration" element={<Registration />} />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/course/running/:dept_name" element={<RunningCourse />} />
            <Route path="/course/running" element={<RunningCourses />} />
            <Route path="/instructor/:id" element={<Instructor />} />
          </Route>
          <Route element={<Dashboard/>}>
            <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
    );
}

export default App;

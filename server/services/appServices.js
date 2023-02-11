import client from '../models/schema.js';
import bcrypt from 'bcrypt';
//  72669 user1
//  44551 user2
//  12078 user3
//  90448 user4
//  79170 user5
//  63395 inst1

export const handleLogin = async (req, res) => {
    try {
        const { userId, password } = req.body;
        if(req.session.userId){ 
            res.status(200).json({ message: 'Already logged in' , username: req.session.username});
            return;
        }
        const user = await client.query(`SELECT * FROM user_password WHERE id = '${userId}'`);
        if (user.rows.length === 0) {
            res.status(400).json({ message: 'Login failed' });
            return;
        }
        const hashedPassword = user.rows[0].hashed_password;

        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (isPasswordCorrect) {
            const data = await client.query(`SELECT name,dept_name,tot_cred FROM student WHERE id = '${userId}'`);
            if(data.rows.length===0){
                res.status(200).json({ message: 'Login successful', instructor: 'TRUE' });
                return;
            }
            req.session.userId = userId;
            req.session.username = data.rows[0].name;
            req.session.department = data.rows[0].dept_name;
            req.session.totalCredits = data.rows[0].tot_cred;
            res.status(200).json({ message: 'Login successful', username: data.rows[0].name , instructor: 'FALSE' });
        }
        else {
            res.status(400).json({ message: 'Login failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const handleLogout = async (req, res) => {
    try {
        if (req.session.userId) {
            req.session.destroy();
            res.status(200).json({ message: 'Logout successful' });
        }
        else {
            res.status(200).json({ message: 'Already Logout' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const coursesTaken = async (req, res) => {
    try {
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        const currcourses = await client.query(`SELECT takes.course_id,semester,year,grade,title,credits FROM takes,course WHERE id = '${req.session.userId}' AND takes.course_id=course.course_id AND year='${currentYear}' AND semester='${currentSemester}'`);
        const courses = await client.query(`SELECT takes.course_id,semester,year,grade,title,credits FROM takes,course WHERE id = '${req.session.userId}' AND takes.course_id=course.course_id AND (year<>'${currentYear}' OR semester<>'${currentSemester}') ORDER BY year DESC,semester DESC`);
        res.status(200).json({ courses: courses.rows , currcourse:currcourses.rows});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const getUser = async (req, res) => {
    try {
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        res.status(200).json({ userId: req.session.userId, username: req.session.username , department : req.session.department , totalCredits : req.session.totalCredits});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const getRunningCourses = async (req, res) => {
    try {
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        const department = await client.query(`SELECT distinct dept_name FROM course,section WHERE semester = '${currentSemester}' AND year = '${currentYear}' AND course.course_id=section.course_id`);
        res.status(200).json({ department: department.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const getRunningCourse = async (req, res) => {
    try {
        const { dept_name } = req.body;
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        const query1 = `SELECT course.course_id as courseid,title,sec_id FROM course,section WHERE semester = '${currentSemester}' AND year = '${currentYear}' AND course.course_id=section.course_id AND dept_name = '${dept_name}'`;
        const query2 = `with S as (${query1}) SELECT courseid,title,ID,S.sec_id as secid FROM teaches,S WHERE teaches.course_id=S.courseid AND teaches.semester='${currentSemester}' AND teaches.year='${currentYear}' AND teaches.sec_id=S.sec_id`;
        const dept = await client.query(`with T as (${query2}) SELECT courseid,title,T.ID,name,secid FROM T,instructor WHERE T.ID=instructor.ID`);
        res.status(200).json({ courses: dept.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const getCourse = async (req, res) => {
    try {
        const { id } = req.body;
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        const query1 = `SELECT * FROM course,section WHERE semester = '${currentSemester}' AND year = '${currentYear}' AND course.course_id=section.course_id AND course.course_id = '${id}'`;
        const query2 = `with S as (${query1}) SELECT * FROM teaches,S WHERE teaches.course_id= '${id}' AND teaches.semester='${currentSemester}' AND teaches.year='${currentYear}' AND teaches.sec_id=S.sec_id`;
        const course = await client.query(`with T as (${query2}) SELECT * FROM T,instructor WHERE T.ID=instructor.ID`);
        const prereq = await client.query(`SELECT prereq_id,title FROM prereq,course WHERE prereq.course_id = '${id}' AND prereq.prereq_id=course.course_id`);
        if(course.rows.length === 0){
            const course = await client.query(`SELECT course_id,title,credits FROM course WHERE course_id = '${id}'`);
            const prereq = await client.query(`SELECT prereq_id,title FROM prereq,course WHERE prereq.course_id = '${id}' AND prereq.prereq_id=course.course_id`);
            res.status(200).json({ courses: course.rows, prereq: prereq.rows });
            return;
        }
        res.status(200).json({ courses: course.rows, prereq: prereq.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const getInstructor = async (req, res) => {
    try {
        const { id } = req.body;
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        const query1 = `SELECT distinct course_id FROM teaches WHERE semester = '${currentSemester}' AND year = '${currentYear}' AND ID = '${id}'`;
        const query2 = `with S as (${query1}) SELECT * FROM course,S WHERE course.course_id=S.course_id`;
        const course = await client.query(`${query2} ORDER BY course.course_id`);
        const instructor = await client.query(`SELECT ID,name,dept_name FROM instructor WHERE ID = '${id}'`);
        const query3 = `SELECT distinct course_id,semester,year FROM teaches WHERE semester <> '${currentSemester}' AND year <> '${currentYear}' AND ID = '${id}'`;
        const courses = await client.query(`with S as (${query3}) SELECT * FROM course,S WHERE course.course_id=S.course_id ORDER BY year DESC,semester DESC`)
        res.status(200).json({instructor: instructor.rows, coursecurr: course.rows, courseprev:courses.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const getAllRunningCourses = async (req, res) => {
    try {
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        const query2 = `SELECT takes.course_id as courseid,sec_id,title FROM takes,course WHERE takes.semester = '${currentSemester}' AND takes.year = '${currentYear}' AND ID = '${req.session.userId}' AND takes.course_id=course.course_id AND grade IS NULL`;
        const querycoursestaken = `SELECT distinct T.course_id FROM takes as T WHERE ID = '${req.session.userId}'`;
        const query3 = `SELECT section.time_slot_id FROM section,takes WHERE ID = '${req.session.userId}' AND section.course_id=takes.course_id AND section.semester=takes.semester AND section.year=takes.year AND section.sec_id=takes.sec_id AND section.year='${currentYear}' AND section.semester='${currentSemester}'`;
        const query = `SELECT course.course_id as courseid,title,sec_id ,(SELECT CASE WHEN section.time_slot_id IN (${query3}) THEN 'TRUE' ELSE 'FALSE' END) as slotclash, (SELECT CASE WHEN course.course_id in (${querycoursestaken}) THEN 'TRUE' ELSE 'FALSE' END) as taken , (SELECT CASE WHEN not exists ((SELECT prereq_id FROM prereq where prereq.course_id = course.course_id) except (${querycoursestaken})) THEN 'TRUE' ELSE 'FALSE' END) as prereq FROM course,section WHERE course.course_id=section.course_id AND semester = '${currentSemester}' AND year = '${currentYear}'`;
        const cor = await client.query(`${query}`);
        const registered = await client.query(`${query2}`);
        res.status(200).json({ courses: cor.rows, registered: registered.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const registerCourses = async (req, res) => {
    try{
        const {courseid,secid} = req.body;
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        await client.query('INSERT INTO takes (ID,course_id,sec_id,semester,year) VALUES ($1,$2,$3,$4,$5)',[req.session.userId,courseid,secid,currentSemester,currentYear]);
        res.status(200).json({ message: 'Registered' });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const dropCourses = async (req, res) => {
    try{
        const {courseid,secid} = req.body;
        if(!req.session.userId){
            res.status(400).json({ message: 'Not logged in' });
            return;
        }
        const today = Date.now();
        const reg = await client.query(`SELECT semester,year,start_time FROM reg_dates ORDER BY year DESC,start_time DESC`);
        var i=0;
        for(;i<reg.rows.length;i++){
            if(Date.parse(reg.rows[i].start_time) <= today){
                break;
            }
        }
        const currentSemester = reg.rows[i].semester;
        const currentYear = reg.rows[i].year;
        await client.query(`DELETE FROM takes WHERE ID='${req.session.userId}' AND course_id='${courseid}' AND sec_id='${secid}' AND semester='${currentSemester}' AND year='${currentYear}'`);
        const query2 = `SELECT takes.course_id as courseid,sec_id,title FROM takes,course WHERE takes.semester = '${currentSemester}' AND takes.year = '${currentYear}' AND ID = '${req.session.userId}' AND takes.course_id=course.course_id AND grade IS NULL`;
        const registered = await client.query(`${query2}`);
        res.status(200).json({ message: 'Dropped', registered: registered.rows });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

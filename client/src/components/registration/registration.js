import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from '../../api/index.js';
import { Button, Card, Table } from 'react-bootstrap';
import { useOutletContext } from "react-router-dom";
import {ReactSearchAutocomplete} from 'react-search-autocomplete'

const Registration = () => {
    const navigate = useNavigate();
    const [data,setData] = useState([]);
    const [register,setRegister] = useState([]);
    const [course,setCourse] = useState([]);
    const [coursedrop,setCoursedrop] = useState([]);
    const [registered,setRegistered] = useState([]);
    const user = useOutletContext();
    if (!user.user) {
        navigate('/login');
    }

    const getData = async () => {
        try{
            const response = await api.getAllRunningCourses();
            setData(response.data.courses.map((obj,i) => ({id: i ,...obj})));
            setRegistered(response.data.registered);
            console.log(data)
            return Promise.resolve(response.data.courses);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getData();
        }
        fetchData();
    },[]);

    const registerData = async (item) => {
        try{
            if(item.length === 0 || !item) return;
            const response = await api.registerCourses({courseid:item.courseid,secid:item.sec_id});
            setRegister(register.filter((obj) => obj.courseid !== item.courseid));
            setRegistered([...registered,item]);
            return Promise.resolve(response.data.courses);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function regData() {
            await registerData(course);
        }
        regData();
        async function fetchData() {
            await getData();
        }
        fetchData();
    },[course]);

    const dropCourse = async (item) => {
        try{
            if(item.length === 0 || !item) return;
            const response = await api.dropCourses({courseid:item.courseid,secid:item.sec_id});
            setRegistered(registered.filter((obj) => obj.courseid !== item.courseid));
            return Promise.resolve(response.data.courses);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function dropData() {
            await dropCourse(coursedrop);
        }
        dropData();
        async function fetchData() {
            await getData();
        }
        fetchData();
    },[coursedrop]);

    const handleOnSearch = (string, results) => {
        return;
      }
    
      const handleOnHover = (result) => {
        return;
      }
    
      const handleOnSelect = (item) => {
        register.some((ele)=>{if(ele.id === item.id) return true;return false;}) ? setRegister([...register]) :setRegister([...register,item]);
        return;
      }
    
      const handleOnFocus = () => {
        return;
      }

      const handleDelete = (item) => {
        setRegister(register.filter((obj) => obj.courseid !== item.courseid));
        }

        const handleRegister = (item) => {
            setCourse(item);
        }

        const handleDrop = (item) => {
            setCoursedrop(item);
        }


    
      const formatResult = (item) => {
        return (
          <>
            <span style={{ display: 'block', textAlign: 'left' }}>id: {item.courseid} title: {item.title} section: {item.sec_id}</span>
          </>
        )
      }
    return (
        <div className="running_courses" style={{margin:'50px 300px 50px 300px'}}>
            <ReactSearchAutocomplete
            fuseOptions={{ keys: ["title","courseid"] }}
            items={data}
            resultStringKeyName="title"
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            styling={{ zIndex: 1 }} 
            formatResult={formatResult}
            />
            {!register[0] ? null : (<Table>
                <thead>
                    <tr>
                        <th>Course Id</th>
                        <th>Course Title</th>
                        <th>Section</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        register.map((ele,index) => {
                            return (
                                <tr key={index}>
                                    <td>{ele.courseid}</td>
                                    <td>{ele.title}</td>
                                    <td>{ele.sec_id}</td>
                                    {ele.taken === "TRUE" ? <td>already taken</td> : (ele.prereq === "FALSE" ? <td>Prerequisite Not satisfied</td> : (ele.slotclash === "TRUE" ? <td>slot clash</td> : <td><Button onClick={() => handleRegister(ele)}>Register</Button></td>))}
                                    <td><Button onClick={() => handleDelete(ele)}>Delete</Button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>)}
            <div style={{margin:'25px 0px 25px 0px'}}><SemisterCard courses={registered} handleDrop={handleDrop}/></div>
        </div>
    );
}

export default Registration;

function SemisterCard(props) {

    return (
    <Card  className="text-center">
      <Card.Header><h6>Registered courses</h6></Card.Header>
      <Card.Body>
        {!props.courses[0] ? null:(<Table hover>
                <thead>
                    <tr>
                        <th>Course Id</th>
                        <th>Course Title</th>
                        <th>Section</th>
                    </tr>
                </thead>
                <tbody>
                    {props.courses.map((ele,index) => {
                        return (
                            <tr key={index}>
                                <td>{ele.courseid}</td>
                                <td>{ele.title}</td>
                                <td>{ele.sec_id}</td>
                                <td><Button onClick={() => props.handleDrop(ele)}>Drop</Button></td>
                            </tr>
                        )
                    })}
                </tbody>
        </Table>)}
      </Card.Body>
    </Card>
    );
}
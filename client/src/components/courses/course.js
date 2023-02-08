import { useEffect , useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import * as api from '../../api/index.js';
import { Card, Table } from 'react-bootstrap';
import { useOutletContext, Link } from "react-router-dom";

const Course = () => {
    const navigate = useNavigate();
    const [data,setData] = useState([]);
    const user = useOutletContext();
    const courseid = useParams();
    if (!user.user) {
        navigate('/login');
    }

    const getData = async (courseid) => {
        try{
            const response = await api.getCourse(courseid);
            setData(response.data);
            return Promise.resolve(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getData(courseid)
        }
        fetchData();
    },[courseid]);

    return (
        <div className="running_courses" style={{margin:'50px 15% 50px 15%'}}>
            <div style={{margin:'25px 0px 25px 0px'}}><SemisterCard course={data}/></div>
        </div>
    );
}

export default Course;

function SemisterCard(props) {
    return !props.course.courses ? null : (
    <Card>
      <Card.Header>
        <h6>Course Id : {props.course.courses[0].course_id}</h6>
        <h6>Course Title : {props.course.courses[0].title}</h6>
        <h6>Credits : {props.course.courses[0].credits}</h6>
        </Card.Header>
      <Card.Body>
       {!props.course.courses[0].building ? <h4> Not offered this semester</h4>:( <Table hover>
            <thead>
                <tr>
                    <th>Venue</th>
                    <th>Section</th>
                    <th>Instructor</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.course.courses.map((ele,index) => {
                        return (
                            <tr key={index}>
                                <td>{ele.building} building, room {ele.room_number}</td>
                                <td>{ele.sec_id}</td>
                                <td><Link to={`/instructor/${ele.id}`}>{ele.name}</Link></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>)}
        <div className="container"><h5>Prequisites : </h5>
        {props.course.prereq[0] ? props.course.prereq.map((ele,index) => {
            return (
                <div key={index}>
                    <p><Link to={`/course/${ele.prereq_id}`}>{ele.prereq_id}</Link> {ele.title}</p>

                </div>)}): <div>None</div>
        }
        </div>
      </Card.Body>
    </Card>
    );
}
import { useEffect , useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import * as api from '../../../api/index.js';
import { Card, Table } from 'react-bootstrap';
import { useOutletContext, Link } from "react-router-dom";

const RunningCourse = () => {
    const navigate = useNavigate();
    const [data,setData] = useState([]);
    const user = useOutletContext();
    const department = useParams();
    if (!user.user) {
        navigate('/login');
    }

    const getData = async (department) => {
        try{
            const response = await api.getRunningCourse(department);
            setData(response.data.courses);
            return Promise.resolve(response.data.courses);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getData(department)
        }
        fetchData();
    },[department]);

    return (
        <div className="running_courses" style={{margin:'50px 300px 50px 300px'}}>
            <div style={{margin:'25px 0px 25px 0px'}}><SemisterCard dept={department} courses={data}/></div>
        </div>
    );
}

export default RunningCourse;

function SemisterCard(props) {
    return (
    <Card  className="text-center">
      <Card.Header><h6>Running courses for {props.dept.dept_name} department</h6></Card.Header>
      <Card.Body>
        <Table hover>
            <thead>
                <tr>
                    <th>Course Id</th>
                    <th>Course Title</th>
                    {/* <th>Section</th>
                    <th>Instructor</th> */}
                </tr>
            </thead>
            <tbody>
                {
                    props.courses.map((ele,index) => {
                        return (
                            <tr key={index}>
                                <td><Link to={`/course/${ele.courseid}`}>{ele.courseid}</Link></td>
                                <td>{ele.title}</td>
                                {/* <td>{ele.secid}</td>
                                <td><Link to={`/instructor/${ele.id}`}>{ele.name}</Link></td> */}
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
      </Card.Body>
    </Card>
    );
}
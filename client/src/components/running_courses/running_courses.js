import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from '../../api/index.js';
import { Card, Table } from 'react-bootstrap';
import { useOutletContext, Link } from "react-router-dom";

const RunningCourses = () => {
    const navigate = useNavigate();
    const [data,setData] = useState([]);
    const user = useOutletContext();
    if (!user.user) {
        navigate('/login');
    }

    const getData = async () => {
        try{
            const response = await api.getRunningCourses();
            setData(response.data.department);
            return Promise.resolve(response.data.department);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getData()
        }
        fetchData();
    },[]);

    return (
        <div className="running_courses" style={{margin:'50px 300px 50px 300px'}}>
            <div style={{margin:'25px 0px 25px 0px'}}><SemisterCard dept={data}/></div>
        </div>
    );
}

export default RunningCourses;

function SemisterCard(props) {
    return (
    <Card  className="text-center">
      <Card.Header>Running Courses</Card.Header>
      <Card.Body>
        <Table hover>
            <thead>
                <tr>
                    <th>Department</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.dept.map((ele,index) => {
                        return (
                            <tr key={index}>
                                <td><Link to={`/course/running/${ele.dept_name}`}>{ele.dept_name}</Link></td>
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
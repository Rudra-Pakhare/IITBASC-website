import { useEffect , useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import * as api from '../../api/index.js';
import { Card, Table } from 'react-bootstrap';
import { useOutletContext, Link } from "react-router-dom";

const Instructor = () => {
    const navigate = useNavigate();
    const [data,setData] = useState({});
    const user = useOutletContext();
    const instid = useParams();
    if (!user.user) {
        navigate('/login');
    }

    const getData = async (instid) => {
        try{
            const response = await api.getInstructor(instid);
            setData(response.data);
            return Promise.resolve(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getData(instid)
        }
        fetchData();
    },[instid]);

    return (
        <div style={{marginTop:'50px'}}>
        { !data.instructor ? null:
            <Card border="light">
      <Card.Body>
        <Card.Title>Prof. {data.instructor[0].name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Department {data.instructor[0].dept_name}</Card.Subtitle>
      </Card.Body>
    </Card> }
                <SemisterCard inst={data.coursecurr} curr={true}/>
                <SemisterCard inst={data.courseprev} curr={false}/>
        </div>
    );
}

export default Instructor;

function SemisterCard(props) {
    return !props.inst ? null : (
    <Card border="light" style={{marginTop:'10px'}}>
      <Card.Header>
        {(props.curr ? <h6>Courses teaching in current semester </h6> :
        <h6>Courses taught in previous semesters</h6>)}
        </Card.Header>
      <Card.Body>
        <Table hover>
            <thead>
                <tr>
                    <th>Course Id</th>
                    <th>Coutse title</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.inst.map((ele,index) => {
                        return (
                            <tr key={index}>
                                <td><Link to={`/course/${ele.course_id}`}>{ele.course_id}</Link></td>
                                <td>{ele.title}</td>
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
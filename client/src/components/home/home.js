import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from '../../api/index.js';
import { Card, Table } from 'react-bootstrap';
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [data,setData] = useState({});
    const [semesters,setSemesters] = useState([]);
    const user = useOutletContext();
    if (!user.user) {
        navigate('/login');
    }

    const getData = async () => {
        try{
            const response = await api.coursesTaken();
            setData(response.data);
            return Promise.resolve(response.data.courses);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const data1 = await getData()
            var sem = [];
            var sems = [];
            var prevsem = data1[0].semester;
            var prevyear = data1[0].year;
            for(let i=0;i<data1.length;i++){
                if(data1[i].semester !== prevsem || data1[i].year !== prevyear){
                    sems.push(sem);
                    sem = [];
                    prevsem = data1[i].semester;
                    prevyear = data1[i].year;
                }
                sem.push(data1[i]);
            }
            sems.push(sem);
            setSemesters(sems); 
        }
        fetchData();
    },[]);

    return (
        <div className="home" style={{margin:'50px 50px 50px 50px'}}>
            <div>
                <h6>Current Semester Details</h6>
            </div>
            <div style={{margin:'25px 0px 25px 0px'}}><SemisterCard sem={data.currcourse}/></div>
            <div>
                <h6>Semester-wise Details</h6>
            </div>
                {
                    semesters.map((ele,index) => {
                    return <div style={{margin:'25px 0px 25px 0px'}} key={index}><SemisterCard sem={ele} key={index}/></div>
                })}
        </div>
    );
}

export default HomePage;

function SemisterCard(props) {
    return !props.sem || props.sem.length === 0? null :(
    <Card  className="text-center">
      <Card.Header>{props.sem[0].semester} {props.sem[0].year}</Card.Header>
      <Card.Body>
        <Table hover>
            <thead>
                <tr>
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Grade</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.sem.map((ele,index) => {
                        return (
                            <tr key={index}>
                                <td>{ele.course_id}</td>
                                <td>{ele.title}</td>
                                <td>{ele.credits}</td>
                                <td>{ele.grade}</td>
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


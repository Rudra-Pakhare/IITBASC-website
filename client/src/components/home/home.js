import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from '../../api/index.js';
import { Card, Table } from 'react-bootstrap';
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [data,setData] = useState([]);
    const [semesters,setSemesters] = useState([]);
    const user = useOutletContext();
    if (!user.user) {
        navigate('/login');
    }

    const getData = async () => {
        try{
            const response = await api.coursesTaken();
            setData(response.data.courses);
            return Promise.resolve(response.data.courses);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const data = await getData()
            var sem = [];
            var sems = [];
            var prevsem = data[0].semester;
            var prevyear = data[0].year;
            for(let i=0;i<data.length;i++){
                if(data[i].semester !== prevsem || data[i].year !== prevyear){
                    sems.push(sem);
                    sem = [];
                    prevsem = data[i].semester;
                    prevyear = data[i].year;
                }
                sem.push(data[i]);
            }
            sems.push(sem);
            setSemesters(sems); 
        }
        fetchData();
    },[data]);

    return (
        <div className="home" style={{margin:'50px 300px 50px 300px'}}>
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
    return !props.sem[0]? null :(
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


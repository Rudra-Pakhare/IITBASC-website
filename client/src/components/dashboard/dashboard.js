import { Nav, Navbar} from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Table ,CardGroup} from 'react-bootstrap';
import { useEffect , useState } from 'react';
import * as api from '../../api/index.js';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [user,setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
        try{
            const response = await api.getUser();
            if (response.status === 200) {
                setUser(response.data);
                return ;
            }
        }
        catch (error) {
            console.log(error);
            if (window.location.pathname === '/login') {
                setUser({});
                return;
            }
            navigate('/login');
            return;
        }
    }
    getUser();
  },[navigate]);

  const handleLogout = async (event) => {
    try {
        const response = await api.logout();
        if (response.status === 200) {
            setUser({});
            navigate('/login');
            return;
        }
    }
    catch (error) {
        console.log(error);

    }
  }
    return (
        <>
        <Header user={user}/>
        {user.userId ? <MyNavbar handleLogout={handleLogout} user={user}/> : null}
        <Outlet context={{user,setUser}}/>
        </>
    )
}

export default Dashboard;



function MyNavbar(props) {
  return (
    <Navbar sticky='top' expand="lg" bg="light">
      <Nav className="m" variant="tabs">
        <Nav.Item>
          <LinkContainer to="/home"><Nav.Link>Home</Nav.Link></LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/home/registration"><Nav.Link>Register</Nav.Link></LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/course/running"><Nav.Link>Running Courses</Nav.Link></LinkContainer>
        </Nav.Item>
      </Nav>
      <Nav className="m" variant="tabs">
        <Nav.Item>
          <Nav.Link onClick={props.handleLogout}>Logout</Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

function Header(props) {
  return (
    <CardGroup>
      <Card border='light' style={{backgroundColor:'#E4F9F5'}}>
        <Card.Body>
          <div>
            <img src={'/Logo.svg'} alt='' style={{float:'left', margin:'0 2rem 0 0'}}/>
            <h2>IIT BOMBAY ASC</h2>
            <h5>Made by Rudra Pakhare and Nishant Singh</h5>
          </div>
        </Card.Body>
      </Card>

      <Card border='light' style={{backgroundColor:'#E4F9F5'}}>
        <Card.Body>
          {props.user.userId ? (<Table style={{marginTop:'1rem'}}>
            <tbody>
              <tr>
                <th><h5>Student ID : {props.user.userId}</h5></th>
                <th><h5>Username : {props.user.username}</h5></th>
              </tr>
              <tr>
                <th><h5>Department : {props.user.department}</h5></th>
                <th><h5>Total Credits : {props.user.totalCredits}</h5></th>
              </tr>
            </tbody>
          </Table>): (<></>)}
        </Card.Body>
      </Card>
    </CardGroup>
  );
}

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as api from '../../api/index.js';
import { useNavigate } from "react-router-dom";
import './login.css';
import { useEffect } from "react";


const LoginPage = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
        try{
            const response = await api.getUser();
            if (response.status === 200) {
                props.setUser(response.data);
                navigate('/home');
                return ;
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    getUser();
  });

    const handleLogin = async (event) => {
        event.preventDefault();
        try{
            const user = {
                userId: event.target[0].value,
                password: event.target[1].value
            }
            const response = await api.login(user);
            if (response.status === 200) {
                if(response.data.instructor==='TRUE'){
                  alert('Instructor login approved by backend frontend not implemented');
                  return;
                }
                else {props.setUser({ userId:user.userId , username:response.data.username});
                navigate('/home');
                return;}
            }
            else {
                console.log('Login failed');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='loginform'>
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>User Id</Form.Label>
        <Form.Control type="Text" placeholder="Enter User Id" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
    </div>
  );
}

export default LoginPage;
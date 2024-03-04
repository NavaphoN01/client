import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { storeUser } from '../helper';
import Swal from 'sweetalert2'
import conf from '../conf';
import Button from '@mui/material/Button';
import '../StyleCSS/login.css';

const initialUser = { identifier: '', password: ''};

function SignIn() {
    const [user, setUser] = useState(initialUser)
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.identifier);
      
      if (isValidEmail && user.password ) {
        const url = `${conf.apiPrefix}/api/auth/local`
        try {
          const { data } = await axios.post(url, user)
          if (data.jwt) {
            Swal.fire({
              icon: 'success',
              title: 'Login Success',
              text: 'Welcome to Website'
            })
            storeUser(data)
            toast.success('Login successful', {
              hideProgressBar: true
            })
            setUser(initialUser)
            navigate('/')
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Login Fail',
            text: 'Check your email or password'
          })
          toast.error("Invalid email or password", {
            hideProgressBar: true
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Fail',
          text: 'Check your email or password'
        })
        toast.error("Please enter a valid email", {
          hideProgressBar: true
        })
      }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setUser({
      ...user,
        [name]: value,
      });
    };

    const handleRegister = () => {
        navigate('/register');
      };

    useEffect(() => {
      localStorage.removeItem('user')
  })
  
    return (
        <div className='main-bg'>
        <div className='main-container'>
        <div className='welcome-text'>Sign-in</div>
        <div className="login-Box">
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }} >
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="identifier"
                      label="Email Address"
                      name="identifier"
                      autoComplete="email"
                      onChange={handleChange}
                      autoFocus
                      
                  />
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={handleChange}
                  />
                  <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 3, mb: 2, backgroundColor: '#4CAF50', color: 'white' }}
                  >
                      Login
                  </Button>
                </Box>
          </div>
        <div className='login-with'>OR LOGIN WITH</div>
        <div className='horizontal-rule' />
        <center>
            <div className="text-dha">
              <h6>Don't have account?</h6>
            </div>
        </center>
        <div className="login-Box2">
        <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, mb: 2, width: '500px', height: '35px' }}
                    onClick={handleRegister}
                >
                    Register
                </Button>
            </div>
      </div>
    </div>
  );
}


export default SignIn;
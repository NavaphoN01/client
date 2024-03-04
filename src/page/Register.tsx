import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import conf from '../conf';
import Button from '@mui/material/Button';
import '../StyleCSS/login.css';

const initialUser = { email: '', password: '', username: ''};

function SignUp() {
    const [user, setUser] = useState(initialUser)
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      
      if (!user.email || !user.password || !user.username || !confirm) {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Incomplete information',
        });
        return;
      }

      if (!user.email || !/@(email\.psu\.ac\.th|psu\.ac\.th|gmail\.com)$/.test(user.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid email ',
          text: 'Check the correct of the email',
        });
        return;
      }
      
      if (user.password !== confirm) {
        toast.error("Passwords do not match", {
          hideProgressBar: true
        })
        Swal.fire({
          icon: 'error',
          title: 'Password error',
          text: 'Passwords do not match',
        })
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(user.password)) {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: "Password = ('A,B,...' + 'a,b,...' + '1,2,3,...')",
        });
        return;

      }
      
     const url = `${conf.apiPrefix}/api/auth/local/register`;
      try {
        if (user.email && user.password && user.username) {
          const res = await axios.post(url, user)
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: 'Register complete'
          })
          navigate('/login', { replace: true })
        } 
    }catch(err) {
      toast.error("Invalid email or password", {
        hideProgressBar: true
      })
    }}

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      if (name === 'Confirm') {
          setConfirm(value);
      } else {
          setUser({
            ...user,
            [name]: value,
          });
      }
    };
    const CheckEmail = (event: { target: { name: string; value: string; }; }) => {
        setUser({ ...user, [event.target.name]: event.target.value });      
    }; 

    const handleLogin = () => {
        navigate('/login');
    };
  
    return (
        <div className='main-bg'>
        <div className='main-container'>
        <div className='welcome-text'>Sign-up</div>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: -1 }} >
                <TextField
                    margin="normal"
                    required
                    sx={{ml: 11, width: '70%'}}
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    onChange={handleChange}
                    autoFocus
                />
                <TextField 
                    margin="normal"
                    required
                    sx={{ml: 11, width: '70%'}}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={CheckEmail}
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    sx={{ml: 11, width: '70%'}}
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    sx={{ml: 11, width: '70%'}}
                    name="Confirm"
                    label="Confirm Password"
                    type="password"
                    id="Confirm"
                    autoComplete="current-password"
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2, ml: 11, width: '70%', height: '35px', backgroundColor: '#4CAF50', color: 'white' }}
                >
                    Register
                </Button>
              </Box>
        <div className='login-with'>OR</div>
        <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, mb: 2, mr: 1.4, width: '70%', height: '35px' }}
                    onClick={handleLogin}
                >
                    Sign-in
                </Button>
      </div>
    </div>
  );
}


export default SignUp;
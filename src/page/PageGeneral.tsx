import { useNavigate } from 'react-router-dom';
import videoBg from '../Videos/Photo_video.mp4';
import '../StyleCSS/pageGeneral.css';
import Button from '@mui/material/Button';

function MainLogin() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };
    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className='main-screen'>
            <div style={{ position: 'relative' }}>
                <div className="grid-main">
                    <video className="videoST" src={videoBg} autoPlay loop muted />
                    <div className="grid-landing">
                        <img className='Logo-landing' src={`${process.env.PUBLIC_URL}/LogoWeb.png`} alt="Logo" />
                        <div className="style-btn">
                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    ml: 10, 
                                    width: '300px', 
                                    height: '50px', 
                                    position: 'absolute',
                                    backgroundColor: '#4CAF50',
                                    color: 'black'
                                }}
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </div>
                        <div className="style-btn2">
                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{  
                                    ml: 10, 
                                    width: '300px', 
                                    height: '50px', 
                                    position: 'absolute',
                                    backgroundColor: '#40A2E3',
                                    color: 'black'
                                }}
                                onClick={handleRegister}
                            >
                                Sign-up
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    );
}

export default MainLogin;

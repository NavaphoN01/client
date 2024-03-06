import React, { useState } from 'react';
import '../StyleCSS/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';

export default function Navbar() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);

    const handleHome = () => {
        navigate('/');
        window.location.reload();
      };

    const handleUserPrivate = () => {
        navigate('/ViewGallery');
        window.location.reload();
    };

    const handleAdd = () => {
        navigate('/Add');
        window.location.reload();
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`Navbar-left ${collapsed ? 'collapsed' : ''}`}>
          {collapsed ? 
          <IconButton onClick={toggleSidebar} sx={{ ml: 1 }}>
            <ArrowForwardIosIcon /> 
            <ArrowForwardIosIcon />
          </IconButton>
          
          
          : <IconButton onClick={toggleSidebar} sx={{ ml: 22 }}>
                <ArrowBackIosNewIcon />
                <ArrowBackIosNewIcon />
            </IconButton>
          }
        <a className='active' onClick={handleHome}>
            {collapsed ?
            <HomeIcon sx={{ ml: 1 }} /> 
            :<>
                <HomeIcon sx={{ ml: 1 }} /> 
                <span className='EditFont'>Home</span>
            </>
            
            }
        </a> 
        <a className='active' onClick={handleAdd}>
            {collapsed ?
                <AddIcon sx={{ ml: 1 }} /> 
            :<>
                <AddIcon sx={{ ml: 1 }}/> 
                <span className='EditFont'>Add</span>
            </>
            
            }
        </a> 
        <a className='active' onClick={handleUserPrivate}>
            {collapsed ?
                <ImageIcon sx={{ ml: 1 }} /> 
            :<>
                <ImageIcon sx={{ ml: 1 }} /> 
                <span className='EditFont'>Edit</span>
            </>
            
            }
        </a>
      </div>
    );
}

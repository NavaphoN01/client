import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { createSvgIcon } from '@mui/material/utils';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import '../StyleCSS/Navbar.css';

const settings = ['Profile', 'Logout'];

const getUser = () => {
  const User = localStorage.getItem("user") || "";
  if (User) {
    return JSON.parse(User);
  }
  return false;
};

const PlusIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus',
);

const Search = styled('div')(({ theme }) => ({
  position: 'absolute',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(19.5),
  marginRight: 0,
  width: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(23),
    width: '70%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '0ch',
    [theme.breakpoints.up('md')]: {
      width: '1000px',
    },
  },
}));

interface NavbarProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export default function Navbar({ setSearchTerm }: NavbarProps) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const userData = getUser();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/Profile');
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const Logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const Home = () => {
    navigate('/');
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar  component="nav"  sx={{ borderBottom: 3, backgroundColor: '#F6F5F5' }}>
        <Toolbar>
            <img className='Logo' src={`${process.env.PUBLIC_URL}/LogoWeb.png`} alt="Logo" onClick={Home}/>
          <Typography variant="h5" component="div" sx={{color:'purple', flexGrow: 1 }}>
            Godzilla
          </Typography>

          <Search sx={{color:'black', flexGrow: 1  ,background: 'white'}}>
            <SearchIconWrapper >
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Search>

          <IconButton sx={{ ml: 3 }} onClick={() => navigate('/Add')}>
            <PlusIcon sx={{ color: 'purple'}} />
          </IconButton>

          <Typography variant="body2" sx={{ mr: 1, color: 'black' , overflow: 'hidden'}}>
              {userData.username}
          </Typography>

          {userData ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '60px', ml:'20px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <div>
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        if (setting === 'Logout') {
                          Logout();
                        } else if (setting === 'Profile') {
                          handleProfileClick();
                        }
                        handleCloseUserMenu();
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                 </div>
                ))}
              </Menu>
            </Box>
          ) : (
              <Button sx={{ mr: 3 }} color="inherit" onClick={handleLoginClick}>
                Login
              </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

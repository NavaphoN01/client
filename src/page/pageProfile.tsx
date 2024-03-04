import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../StyleCSS/profile.css';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import conf from "../conf";
import { Grid, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";

const getUser = () => {
  const User = localStorage.getItem("user") || "";
  if (User) {
    return JSON.parse(User);
  }
  return false;
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function Profile() {
    const [searchTerm, setSearchTerm] = useState('');
    const userData = getUser();
    const [users, setUser] = useState(null);
    const navigate = useNavigate();
    const avatar = `${conf.apiPrefix}${userData.Avatar}`
    const [username, setUsername] = useState<string>("");
    const [Age, setAge] = useState<string>("");
    const [tel, setTel] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [Gender, setGender] = useState<string>("");

    const handleCloseDialog = () => {
        setUser(null);
      };

    const handleImageClick = () => {
        setUser(userData);
    };

      const handleSubmit = async (): Promise<void> => {
        if (!userData) {
            
          return;
        }
    
        try {
          const response = await fetch(`${conf.apiPrefix}/api/users/${userData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.jwt}`
            },
            body: JSON.stringify({
            username,
            Age,
            tel,
            description,
            Gender,
            }),
          });
    
          if (response.ok) {
            console.log("Image updated successfully");
            handleCloseDialog();
            window.location.reload();
          } else {
            console.error(`Failed to update image. Status code: ${response.status}`);
          }
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() =>{

    },[console.log(userData)]);

    return (
        <div>
            <Navbar setSearchTerm={setSearchTerm} />
            <div className="profile-grid">
                <div className="profile-box">
                    <div className="profile-boxChild">
                        <div className="avatar">
                            <Avatar src={`${conf.apiPrefix}${userData.Avatar}`} />
                        </div>
                        <div className="grid-text">
                            <div className="profile-text">
                               {userData.username}
                            </div>
                            <div className="profile-text">
                                <span>email: {userData.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-boxChild2">
                        <div className="grid-text">
                            <div className="profile-text2">
                                <span>username: {userData.username}</span>
                            </div>
                            <div className="profile-text2">
                                <span>email: {userData.email}</span>
                            </div>
                            <div className="profile-text2">
                                <span>Age: {userData.Age}</span>
                            </div>
                            <div className="profile-text2">
                                <span>Gender: {userData.Gender}</span>
                            </div>
                            <div className="profile-text2">
                                <span>tel: {userData.tel}</span>
                            </div>
                            <div className="profile-text2">
                                <span>Description: {userData.description}</span>
                            </div>
                            <div className="profile-text2">
                                <span>start date: {formatDate(userData.createdAt)}</span>
                            </div>
                            <Button variant="contained" sx={{ width:'100px', mt:-90, ml:140}} onClick={handleImageClick}>Edit</Button>
                        </div>

                        <Dialog open={users !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <Grid container spacing={2}>
                            <Grid item xs={9.8}>
                            <DialogTitle>
                                Edit Profile
                            </DialogTitle>
                            </Grid>
                            <Grid item xs={2.2} mt={2}>
                            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                                Save
                            </Button>
                            </Grid>
                        </Grid>

                        <DialogContent>
                            <Grid container spacing={3}>

                            <Grid item xs={12} md={20}>
                                <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={username}
                                defaultValue
                                onChange={(event) => setUsername(event.target.value)}

                                />
                                <TextField
                                label="Age"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={Age}
                                onChange={(event) => setAge(event.target.value)}

                                />
                                <TextField
                                label="Gender"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={userData.Gender}
                                onChange={(event) => setGender(event.target.value)}

                                />
                                <TextField
                                label="Tel"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={tel}
                                onChange={(event) => setTel(event.target.value)}

                                />
                                <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}

                                />
                                
                            </Grid>
                            </Grid>
                        </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
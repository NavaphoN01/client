import { userData } from "../../src/helper";
import Image from "../Models/Model_image";
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import conf from '../conf';
import Swal from 'sweetalert2';
import repository from '../Repository';
import { Grid, Box, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import NavBarLeft from '../components/NavbarLeft';
import '../StyleCSS/View.css';
import '../StyleCSS/Loader.css';

const user = userData();

export default function UserPrivate() {
  const navigate = useNavigate();
  const [IMG, setIMG] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [Title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [close, setClose] = useState(false);

  const fetchImg = async () => {
    try {
      setLoader(true);
      const result = await repository.userResult.getAll();
      if (result) {
        const userImages = result.filter(img => img.attributes.email === user.email);
        setIMG(userImages);
      }
      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageClick = (img: Image) => {
    setSelectedImage(img);
    setClose(true);
    setTitle(img.attributes.Title || "");
    setDescription(img.attributes.description || "");
  };

  const handleCloseDialog = () => {
    setClose(false);
  };

  async function handleDeleteClick(id: string) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "If you confirm, you cannot go back.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel'
    });

    if (result.isConfirmed) {
      try {
        const resp = await fetch(`${conf.apiPrefix}/api/images/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.jwt}`
          }
        });
        const data = await resp.json();
        fetchImg();
      } catch (err) {
        console.error(err);
      }
    }
  }

  const handleSubmit = async (): Promise<void> => {
    setClose(false);
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "If you confirm, you cannot go back.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel'
    });

    if (!selectedImage) {
      return;
    }
    if (result.isConfirmed) {
    try {
      const response = await fetch(`${conf.apiPrefix}/api/images/${selectedImage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.jwt}`
        },
        body: JSON.stringify({
        data: {
            Title,
            description,
        },
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
  }
  };

  useEffect(() => {
    fetchImg();
  }, []);


  if (!user) {
    return (
      <div>
        {loader ? <div className="loader"></div> 
        :
        <Navigate to="/mainLogin" />}
      </div>);

  } else {
  return (
    <div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <NavBarLeft />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="view-header"></div>
      {loader ? <div className="loader"></div> :
       <div className="main-view">
          {IMG.map((img, index) => (
            <Grid  key={index}>
              <Box sx={{ p: 2 }}>
              <div className="card">
              <img
                src={selectedImage?.attributes.picture?.data?.[0]?.attributes.url || ''}
                alt={selectedImage?.attributes.Title || ''}
                style={{ width: '100%', height: 'auto' }}
              />
                <div className="card__content" onClick={() => handleImageClick(img)} style={{ cursor: 'pointer' }}>
                  <p className="card__title">{img.attributes.Title}</p>
                  <p className="card__description">{img.attributes.description}</p>
                </div>
              </div>
              <Button
                sx={{
                  '&:hover': {
                  background: 'rgb(253, 44, 44)',
                  color: 'white'
                  },
                  ml: 10,
                  mt:3,
                }}
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(img.id.toString())}
              >
                Delete
              </Button>
              </Box>
            </Grid>
          ))}
      </div>}

        <Dialog open={close !== false} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <Grid container spacing={2}>
            <Grid item xs={9.8}>
              <DialogTitle>
                Edit Details
              </DialogTitle>
            </Grid>
            <Grid item xs={2.2} mt={2}>
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                Save
              </Button>
            </Grid>
          </Grid>

          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <img
                  src={selectedImage?.attributes.picture.data[0].attributes.url}
                  alt={selectedImage?.attributes.Title}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Grid>
              <Grid item xs={12} md={20}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={Title}
                  onChange={(event) => setTitle(event.target.value)}
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
  );
}
}

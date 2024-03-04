import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Image from '../Models/Model_image';
import { ImageRepository } from '../Repository/ImageRepository';
import conf from "../conf";
import { Navigate, useNavigate } from 'react-router-dom';
import '../StyleCSS/Gallery.css';
import '../StyleCSS/Loader.css';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';

const getUser = () => {
  const User = localStorage.getItem("user") || "";
  if (User) {
    return JSON.parse(User);
  }
  return false;
};

const Home = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userData = getUser();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoader(true);
        const imageRepository = new ImageRepository();
        const fetchedImages = await imageRepository.getAll();
        const sortedImages = (fetchedImages as Image[]).sort((a, b) => {
          const dateA = new Date(a.attributes.createdAt);
          const dateB = new Date(b.attributes.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        const filteredImages = sortedImages.filter(image =>
          image.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setImages(sortedImages || []);
        setLoader(false);
      } catch (error) {
        setError("Error fetching images. Please try again.");
      }
    };

    fetchImages();
  }, []);

  const handleDownload = async (imageId: string, imageName: string) => {
    try {
      const response = await fetch(`${conf.apiPrefix}${imageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = imageName;
      link.click();
    } catch (error) {
      console.error(error);
      setError('Error downloading image. Please try again.');
    }
  };

  const openPopup = (image: Image) => {
    setSelectedImage(image);
  };

  const closePopup = () => {
    setSelectedImage(null);
  };

  if (!userData) {
    return <Navigate to="/mainLogin" />;
  } else {
    return (
      
      <div className='main'>
        <Navbar setSearchTerm={setSearchTerm} />
      
      <Grid>
        <div className='Box'>
          <h2 className='Font-header'>Image</h2>

          {loader ? <div className="loader"></div> :
          <div className='gallery'>
            {error && <div>{error}</div>}
            {(searchTerm.trim() === '' ? images : images.filter(image =>
              image.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
            )).map((image) => (
              <div className="class='card'" key={image.id}>
                <img
                  className='ImgST'
                  src={`${conf.apiPrefix}${image.attributes.picture.data[0].attributes.url}`}
                  alt={image.attributes.Title}
                  onClick={() => openPopup(image)}
                />
                <span className='Font-Style'>{image.attributes.Title}</span>
              </div>
            ))}  
            </div>}
          </div>
        </Grid>
      

        <Dialog open={Boolean(selectedImage)} onClose={closePopup} maxWidth="sm" fullWidth>
          <Grid container spacing={1} sx={{backgroundColor: '#F8F4EC'}}>
            <Grid item xs={6}>
            <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <img
                  className='ImgST'
                  src={`${conf.apiPrefix}${selectedImage?.attributes.picture.data[0].attributes.url}`}
                  alt={selectedImage?.attributes.Title}
                  style={{ width: '100%', height: '300px' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Grid>
          <Grid item xs={6}> 
           <Grid item xs={12} mt={3}>
             
             <Stack
              direction="row"
              spacing={17}
             >
              <Avatar/>
              <Box>
              <Button 
                onClick={() => handleDownload(selectedImage?.attributes.picture.data[0].attributes.url || '', selectedImage?.attributes.Title || '')}
                sx={{
                  '&:hover': {
                    background: 'rgb(44, 200, 44)',
                    color: 'white'
                  }, 
                  width: "100px",
                }}
                variant="contained"
              >
                Download
              </Button>
              </Box>
            </Stack>
            <Stack sx={{mt: 3}} justifyContent="flex-start" spacing={1.5}>
              <span className='Font-Style'>User: {selectedImage?.attributes.user_name}</span>
              <span className='Font-Style'>Email: {selectedImage?.attributes.email}</span>
              <span className='Font-Style'>Title: {selectedImage?.attributes.Title}</span>
              <span className='Font-Style'>Description: {selectedImage?.attributes.description || "-----------"}</span>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
     </Dialog>
  </div>
  );
 }
};

export default Home;

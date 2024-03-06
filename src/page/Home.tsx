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
    // Fetch the image using a direct URL
    const response = await fetch(`${imageId}`, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error('Failed to download image');
    }

    // Read the response as a blob
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = imageName;

    // Append the link to the body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Clean up: remove the link and revoke the object URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
      <div>
        <Navbar setSearchTerm={setSearchTerm} />

        <div className="card-wave">
        <div className="image"></div>

        <div className="infotop">
          <br />
          Godzilliar
          <br />
          <div className="name">Website นี้เป็นเว็บที่รวบรวมรูปภาพที่หลากหลายจากผู้ใช้ทั่วโลกเเละมีรูปที่อยู่ในคลังกว่า 1000+ ให้โหลดได้ฟรี</div>
          <div className="name">โดยเราได้รวบรวมรูป (Anime, Meme, wallpaper, ธรรมชาติ และอื่น ๆ)</div>
        </div>
      </div>
      <Grid>
        <div className='Box'>
          <h2 className='Font-header'>Picture Gallery</h2>

          {loader ? <div className="loader"></div> :
          <div className='gallery'>
            {error && <div>{error}</div>}
            {(searchTerm.trim() === '' ? images : images.filter(image =>
              image.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
            )).map((image) => (
              <div className="class='card'" key={image.id}>
                <img
                  className='ImgST'
                  src={image.attributes.picture.data[0].attributes.url}
                  alt={image.attributes.Title}
                  onClick={() => openPopup(image)}
                />
              </div>
            ))}  
            </div>}
          </div>
        </Grid>
      

        <Dialog open={Boolean(selectedImage)} onClose={closePopup} maxWidth="sm" fullWidth>
          <Grid container spacing={1} sx={{backgroundColor: '#F8F4EC'}}>
            <Grid item xs={12}>
            <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <img
                  className='ImgST2'
                  src={selectedImage?.attributes.picture.data[0].attributes.url}
                  alt={selectedImage?.attributes.Title}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Grid>
          <Grid item xs={12} mb={5}> 
           <Grid item xs={10.5} ml={6}>
             
             <Stack
              direction="row"
              spacing={28}
             >    
              <Stack justifyContent="flex-start" spacing={1.5}>
                <span className='Font-Style'>User: {selectedImage?.attributes.user_name}</span>
                <span className='Font-Style'>Email: {selectedImage?.attributes.email}</span>
                <span className='Font-Style'>Title: {selectedImage?.attributes.Title}</span>
                <span className='Font-Style'>Description: {selectedImage?.attributes.description || "-----------"}</span>
              </Stack>     
              <Box>
              <button className='Button'
                onClick={() => handleDownload(selectedImage?.attributes.picture.data[0].attributes.url || '', selectedImage?.attributes.Title || '')}
              >
                Download
              </button>
              </Box>
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

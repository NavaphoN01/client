import React from "react";
import { useState, useEffect, useRef } from "react";
import conf from "../conf";
import { TextField } from "@mui/material";
import User from "../Models/Model_User";
import Swal from 'sweetalert2'
import { Navigate, useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content'

import NavbarLeft from "../components/NavbarLeft";
import '../StyleCSS/PageAdd.css';
import '../StyleCSS/Loader.css';
import { userData } from "../../src/helper";

const user = userData();

const getUser = () => {
  const User = localStorage.getItem("user") || "";
  if (User) {
    return JSON.parse(User);
  }
  return false;
};

const Add = () => {
  const [users, setUser] = useState<User | null>(null);
  const userData = getUser();
  const MySwal = withReactContent(Swal);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [Title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    setLoader(false);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedImage = files[0];
      setImage(selectedImage);
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancel = () => {
    navigate('/Add');

  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedImage = files[0];
      setImage(droppedImage);
      setImageUrl(URL.createObjectURL(droppedImage));
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    
    if (!user) {
      alert("You are not authorized to create an image.");
      return;
    }

    if (!image) {
        MySwal.fire({
          title: 'Missing Image',
          icon: 'error',
          text: 'Please select an image before submitting.',
        });
        return;
      }

    const formData = new FormData();

    formData.append("data", JSON.stringify({
      Title,
      description,
      user_name: user.username,
      email: user.email,

    }));

    formData.append("files.picture", image!);

    try {
      const response = await fetch(`${conf.apiPrefix}/api/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
        body: formData,
      });
      if (response.ok) {
        MySwal.fire({
          title: 'Complete!',
          icon: 'success',
          text: 'Add complete',
        }).then(() => {

        });
        
      } else {
        console.error(`Failed to add image. Status code: ${response.status}`);
        MySwal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'not complete',
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        title: 'Error!',
        icon: 'error',
        text: 'error',
      });
    }
  };

  if (!userData) {
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
        <NavbarLeft />
      </div>
      <div className="layout-bg">
      <div className="box-layout">
      <form className="dropzone-box" onSubmit={handleSubmit}>
        <h2>Upload files</h2>
        <p>Click to upload or drag and drop</p>
        <div 
          className="dropzone-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleFileClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="picture/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {imageUrl && <img className="img" src={imageUrl} alt="Selected or dropped image" style={{ maxWidth: "480px",}} />}
          {!imageUrl && 
          <>
          <div className="file-upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-cloud-upload" width="24"
              height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
              <path d="M9 15l3 -3l3 3" />
              <path d="M12 12l0 9" />
          </svg>
      </div>
      
          <p
            className="file-info"
          >
            No Files Selected
          </p>
         </>}
        </div>

        <label className="label">Title</label>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{backgroundColor: 'white'}}
            variant="outlined"
            fullWidth
            value={Title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label className="label">Description</label>
          <TextField
            sx={{backgroundColor: 'white'}}
            variant="outlined"
            fullWidth
            multiline
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </form>

        <div className="dropzone-actions">
            <button type="reset" onClick={handleCancel}>
                Cancel
            </button>
            <button id="submit-button" type="submit">
                Save
            </button>
        </div>
      </form>
     </div>
    </div>
  </div>
  );
  }
}

export default Add;

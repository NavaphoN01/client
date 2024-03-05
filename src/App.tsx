import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import Register from "./page/Register";
import MainLogin from './page/PageGeneral';
import Add from './page/pageAdd';
import ViewGallery from './page/ViewMyGallery';
import Profile from './page/pageProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mainLogin" element={<MainLogin />} />
        <Route path="/Add" element={<Add />} />
        <Route path="/ViewGallery" element={<ViewGallery/>} />
        <Route path="/Profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  );
}

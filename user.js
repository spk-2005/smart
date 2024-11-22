import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './header';
import Home from './home';
import Environment from './environment';
import Food from './food';
import Health from './health';
import Contact from './contact';
import Register from './register';
import Contest from './contest';
import Adminsig from './adminsig';
import ProtectedRoute from './ProtectedRoute';
import Admin from './admin';
import Adminheader from './adminheader';
import './user.css';
import Immunity from './immunity';
import Diabetes from './diabetes';
import Hyper from './hyper';
import Food1 from './food1';
import Contestf from './contestf';
import Disasters from './disasters';
import Profile from './profile';
function UserContent() {
  const location = useLocation(); // Get the current location

  const hiddenHeaderPaths = ['/admin', '/adminsig', '/winners', '/users', '/suggestions', '/rating'];

  // Check if the current path includes any of the defined paths
  const shouldShowHeader = !hiddenHeaderPaths.some((path) => location.pathname.includes(path));
  const isAdminSigPath = location.pathname === '/adminsig';

  return (
    <>
      {!isAdminSigPath && shouldShowHeader && <Header />}
      {!isAdminSigPath && !shouldShowHeader && <Adminheader />}

      <section id="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/environment" element={<Environment />} />
          <Route path="/food" element={<Food />} />
          <Route path="/health" element={<Health />} />
          <Route path='disasters' element={<Disasters/>}/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contest/:contest" element={<Contest />} />
          <Route path="/adminsig" element={<Adminsig />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path='/immunity' element={<Immunity/>}/>
          <Route path='/food' element={<Food/>}/> 
          <Route path='diabetes' element={<Diabetes/>}/>
          <Route path='/hyper' element={<Hyper/>}/>
          <Route path='/food1' element={<Food1/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='contestf/:contest' element={<Contestf/>}/>
        </Routes>
      </section>
    </>
  );
}

export default function User() {
  return (
    <BrowserRouter>
      <UserContent />
    </BrowserRouter>
  );
}

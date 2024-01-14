import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Navbar from './components/Navbar';

function App() {

  const Routing = () => {
    return (
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    );
  };
  return (
  <>  
      <Navbar/>
      <Routing />
    </>
  );
}

export default App;

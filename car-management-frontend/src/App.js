import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import CarList from './components/CarList';
import CarForm from './components/CarForm';
import CarDetail from './components/CarDetail';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Car Management
          </Typography>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                My Cars
              </Button>
              <Button color="inherit" component={Link} to="/add">
                Add Car
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box mt={3}>
        <Routes>
          <Route path="/" element={token ? <CarList token={token} /> : <Navigate to="/login" />} />
          
          <Route path="/login" element={<Login setToken={setToken} />} />
          
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/add"
            element={
              token ? <CarForm token={token} onSave={() => console.log('Car added')} /> : <Navigate to="/login" />
            }
          />
          
          <Route
            path="/cars/:id"
            element={token ? <CarDetail token={token} /> : <Navigate to="/login" />}
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  TextField,
  List,
  ListItem,
  Typography,
  Container,
  Box,
  Divider,
} from '@mui/material';
import './CarList.css'; 

const API_BASE_URL = process.env.REACT_APP_API_URL;

const CarList = ({ token }) => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(response.data);
    };
    fetchCars();
  }, [token]);

  const filteredCars = cars.filter(car =>
    car.title.toLowerCase().includes(search.toLowerCase()) ||
    car.description.toLowerCase().includes(search.toLowerCase()) ||
    car.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container maxWidth="md" className="car-list-container">
      <Box mt={5}>
        <Typography variant="h4" className="car-list-header">
          My Cars
        </Typography>
        <TextField
          label="Search Cars"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <List>
          {filteredCars.map((car) => (
            <React.Fragment key={car._id}>
              <ListItem className="car-list-item">
                <Box width="100%">
                  <Link to={`/cars/${car._id}`} className="car-title-link">
                    <Typography variant="h6" className="car-title">
                      {car.title}
                    </Typography>
                  </Link>
                  <Typography variant="body2" className="car-description">
                    {car.description}
                  </Typography>
                  <Box className="car-tags">
                    {car.tags.map((tag, index) => (
                      <Typography key={index} variant="caption" className="car-tag">
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default CarList;

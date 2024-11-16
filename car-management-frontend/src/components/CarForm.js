import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const CarForm = ({ token, onSave, editingCar, existingData }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState(
    existingData || {
      title: '',
      description: '',
      tags: '',
      images: [],
    }
  );

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('tags', form.tags);
      Array.from(selectedFiles).forEach((file) => formData.append('images', file));

      if (editingCar) {
        // Edit existing car
        await axios.put(`${API_BASE_URL}/api/cars/${editingCar}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/cars`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (onSave) onSave(); 
      navigate('/'); 
    } catch (error) {
      console.error('Error submitting car:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          {editingCar ? 'Edit Car' : 'Add Car'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tags (comma-separated)"
            name="tags"
            value={form.tags}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
            Upload Images (Max 10)
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : 'No files selected'}
          </Typography>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {editingCar ? 'Update Car' : 'Add Car'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CarForm;

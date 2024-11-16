import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import './CarDetail.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const CarDetail = ({ token }) => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', tags: '', images: [] });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(response.data);
        setEditForm({
          title: response.data.title,
          description: response.data.description,
          tags: Array.isArray(response.data.tags) ? response.data.tags.join(', ') : '',
          images: response.data.images,
        });
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };
    fetchCar();
  }, [id, token]);

  useEffect(() => {
    if (car?.images?.length) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [car]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageDelete = (image) => {
    setImagesToDelete((prev) => [...prev, image]);
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  const handleImageUpload = (e) => {
    setNewImages((prev) => [...prev, ...e.target.files]);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedCar = {
        title: editForm.title,
        description: editForm.description,
        tags: editForm.tags.split(',').map((tag) => tag.trim()), 
      };
  
      const formData = new FormData();
      formData.append('title', updatedCar.title);
      formData.append('description', updatedCar.description);
  
      updatedCar.tags.forEach((tag) => formData.append('tags', tag));
  
      imagesToDelete.forEach((image) => formData.append('imagesToDelete', image));
  
      Array.from(newImages).forEach((image) => formData.append('newImages', image));
  
      const response = await axios.put(`${API_BASE_URL}/api/cars/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  

      setCar(response.data);
      setEditMode(false);
      setNewImages([]);
      setImagesToDelete([]);
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };
  

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteDialogOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  if (!car) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Box className="image-carousel">
          {editMode ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Current Images
              </Typography>
              <Box>
                {editForm.images.map((image, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <img
                      src={`${API_BASE_URL}/${image}`}
                      alt={`Car ${index + 1}`}
                      style={{ maxHeight: '100px', objectFit: 'contain', marginRight: '10px' }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleImageDelete(image)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
              </Box>
              <Box mt={2}>
                <Button variant="contained" component="label">
                  Upload New Images
                  <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                </Button>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {newImages.length > 0 && `${newImages.length} new image(s) selected`}
                </Typography>
              </Box>
            </Box>
          ) : (
            car.images.map((image, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}/${image}`}
                alt={`Car ${index + 1}`}
                style={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            ))
          )}
        </Box>

        {editMode ? (
          <Box>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              name="title"
              value={editForm.title}
              onChange={handleInputChange}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              name="description"
              value={editForm.description}
              onChange={handleInputChange}
            />
            <TextField
              label="Tags (comma-separated)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="tags"
              value={editForm.tags}
              onChange={handleInputChange}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>
              {car.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {car.description}
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Tags:
              </Typography>
              <Box>
                {car.tags.map((tag, index) => (
                  <Chip key={index} label={tag} className="car-tag" />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        <Box mt={4}>
          {!editMode && (
            <>
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ ml: 2 }}
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this car? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CarDetail;

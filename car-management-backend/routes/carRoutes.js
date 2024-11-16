const express = require('express');
const upload = require('../uploads/upload');
const {
  createCar,
  listCars,
  getCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(protect, upload.array('images', 10), createCar)
  .get(protect, listCars);

router
  .route('/:id')
  .get(protect, getCar)
  .put(protect, upload.array('images', 10), updateCar)
  .delete(protect, deleteCar);

module.exports = router;

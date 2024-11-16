const fs = require('fs');
const path = require('path');
const Car = require('../models/carModel');

exports.createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const parsedTags = Array.isArray(tags) ? tags : tags.split(',').map((tag) => tag.trim());

    const car = await Car.create({
      title,
      description,
      tags: parsedTags,
      images,
      owner: req.user.id,
    });

    res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error.message);
    res.status(500).json({ message: 'Error creating car', error: error.message });
  }
};

exports.listCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user.id });
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error.message);
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to access this car' });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car details:', error.message);
    res.status(500).json({ message: 'Error fetching car details', error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { title, description, tags, imagesToDelete } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car || car.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Car not found or unauthorized' });
    }

    // Delete specified images
    if (imagesToDelete && Array.isArray(imagesToDelete)) {
      imagesToDelete.forEach((imagePath) => {
        const absolutePath = path.resolve(imagePath);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
        car.images = car.images.filter((img) => img !== imagePath);
      });
    }

    const newImages = req.files ? req.files.map((file) => file.path) : [];
    car.images = [...car.images, ...newImages];

    car.title = title || car.title;
    car.description = description || car.description;
    car.tags = Array.isArray(tags) ? tags : tags.split(',').map((tag) => tag.trim());

    await car.save();
    res.status(200).json(car);
  } catch (error) {
    console.error('Error updating car:', error.message);
    res.status(500).json({ message: 'Error updating car', error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car || car.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Car not found or unauthorized' });
    }

    car.images.forEach((imagePath) => {
      const absolutePath = path.resolve(imagePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    });

    await car.deleteOne();
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error.message);
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
};

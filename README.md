# 🚗 Car Management Application

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.x-green)
![React](https://img.shields.io/badge/react-%3E%3D18.x-blue)

Car Management Application is a comprehensive platform where users can **create**, **view**, **edit**, and **delete cars**. Each car includes up to 10 images, a title, description, and tags (e.g., car type, company, dealer). The application features **user authentication**, access control, and search functionality across products.

---

## 🌐 Deployment
- **Frontend:** [Deployed on Render](https://car-management-app-fronted.onrender.com)
- **Backend:** [Deployed on Render](https://car-management-app-backend-wje9.onrender.com)
---

## 🛠️ API Documentation
The backend API is fully documented in Postman. You can explore the endpoints [here](https://car-management-app-backend-wje9.onrender.com/api/docs)

---

## 🌟 Features
- **User Authentication**: Secure login and signup system with JWT authentication.
- **CRUD Operations**: Add, view, update, and delete cars.
- **Image Management**: Upload up to 10 car images, delete existing ones, and add new ones.
- **Search Functionality**: Global search by title, description, or tags.
- **Responsive Frontend**: Built using React.js and Material-UI for a professional user interface.
- **Backend API Documentation**: [Postman Collection](https://car-management-app-backend-wje9.onrender.com/api/docs)

---

## 🚀 Tech Stack
- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB Atlas
- **Deployment**: Render.com

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/car-management-app.git
cd car-management-app
```
### 🔧 Backend Installation & Setup

#### 1️⃣ Navigate to the Backend Directory
Once the repository is cloned, navigate to the `car-management-backend` directory:
```bash
cd car-management-backend
```
#### 2️⃣ Install Backend Dependencies
Run the following command to install all necessary dependencies:
```bash
npm install
```
#### 3️⃣ Configure Environment Variables
Create a .env file in the car-management-backend directory and add the following environment variables:
```bash
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://your-frontend-url-on-render.com
```
#### 4️⃣ Start the Backend Server
Run the following command to start the backend server:
```bash
npm start
```
---

## 🖼️ Screenshots
### Dashboard Page
![image](https://github.com/user-attachments/assets/ee619ed7-6849-482d-9be2-6837729e6184)

### Car Details Page
![image](https://github.com/user-attachments/assets/68816625-b758-4020-978d-f686022b7742)

---

## 🧪 Testing with Postman
1. Import the Postman collection linked above.
2. Use the ```/auth/login``` endpoint to authenticate and obtain a JWT token.
3. Use the token in the ```Authorization header``` (Bearer token) to access secured endpoints like ```/cars```.

---

## 📝 License
This project is licensed under the [MIT License]().

---

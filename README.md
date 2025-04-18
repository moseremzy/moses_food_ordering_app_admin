# 🍽️ Food Ordering Web App Admin Dashboard
A full-stack admin dashboard for efficiently managing the food ordering platform, built with Vue and Express.
Sharing the same modern architecture as the main platform, this dashboard empowers admins to handle orders, track user activity, manage menus, and oversee operations in real-time. With secure authentication, responsive design, and seamless data flow via a robust API, it ensures smooth and reliable backend control.

## 🛠️ Tech Stack

### Frontend (Client)
- **Vue.js** – For a fast, reactive user interface  
- **Pinia** – State management made simple and scalable  
- **Axios** – Handles HTTP requests to the backend API

### Backend (Server)
- **Express.js** – Lightweight and fast Node.js web framework  
- **CORS** – Ensures only the frontend can securely access the API  
- **express-session** – Manages admin sessions for authentication  
- **MySQL** – Relational database for persistent data storage

## ⚙️ Features
- 🔐 **Authentication with Sessions** – Admin stay logged in using secure session-based auth handled on the backend  
- 📦 **API-Driven Architecture** – The backend provides RESTful endpoints consumed by the Vue frontend  
- 📊 **State Management with Pinia** – Consistent data across views like customers, orders, and items info  
- 🔄 **CORS Security** – Only requests from the frontend origin are allowed  
- 🧾 **Order Oversight System** – View, update, and manage customer orders in real time with live status control

## 📁 Folder Structure
```
food_ordering_app/
├── client/               # Vue.js frontend
│   └── src/
│       ├── stores/       # Pinia stores (admin, customers, interactive, items, orders)
│       ├── router/       # Vue page routes
│       ├── views/        # Vue pages
│       ├── middlewares/  # Custom javascript logics
│       └── components/   # Vue components
│   └── api.js            # controllers

├── server/               # Express.js backend
│   ├── api/              # Controllers
│   ├── images/           # Static files (images)
│   ├── middlewares/      # Middleware logic (e.g., sessions, auth checks)
│   ├── routes/           # API routes
│   └── views/            # Handlebars mail templates
│
├── food_ordering_app.sql # the actual database file containing db schema
```

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/moseremzy/moses_food_ordering_app_admin.git
cd food_ordering_app_admin
```

### 2. Install dependencies

**Frontend**
```bash
cd client
npm install
```

**Backend**
```bash
cd ../server
npm install
```

### 3. Run the app

**Backend (Express server)**
```bash
npm start
```

**Frontend (Vue app)**
```bash
npm run dev
```

## 📌 Notes
1. Ensure your MySQL database is running and configured in the backend's `database.js` file  
2. Update the CORS origin in the backend to match your frontend URL  
3. The app is structured to be hosted on the same server using Express to serve both the API and built Vue files
4. Import the food_ordering_app.sql file located in the root folder into your MySQL server before running the backend.

## 📫 Contact
Built with ❤️ by **Agbaoje Moses**  
Feel free to reach out via [GitHub](https://github.com/moseremzy)

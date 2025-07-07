# 👨‍💼 Employee Management System

![MERN](https://img.shields.io/badge/MERN-Stack-blueviolet)
![Status](https://img.shields.io/badge/Status-In_Progress-important)
![License](https://img.shields.io/badge/License-MIT-green)
![MadeWith](https://img.shields.io/badge/Made%20with-JavaScript-yellow)

> 🚀 A Full-Stack Employee Management System built with the MERN stack — MongoDB, Express.js, React.js, and Node.js.
> 
> 📽️ [Click to watch Demo Video](https://www.linkedin.com/posts/vinod-rajapaksha_mern-fullstackdeveloper-reactjs-activity-7347814142122016768-1cX-?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEWTQhABlCL5huTssw4TKtfEz7DeRMoYJmo)

---

## 🌟 Features

- 👥 Add, view, edit, and delete employees  
- 🔍 Search employees by name
- 📊 Dashboard with analytics and charts
- 🌙 Toggle between Dark Mode / Light Mode for better user experience  
- 📄 View detailed employee info  
- 📦 Store employee data in MongoDB  
- ⚡ RESTful API integration with Express  
- 💻 Beautiful and responsive UI with React  
- 🧠 Clean code with modular structure  

---

## 🛠️ Tech Stack

| Frontend       | Backend       | Database | Tools           |
|----------------|---------------|----------|------------------|
| React.js       | Express.js    | MongoDB  | Postman          |
| Axios          | Node.js       | Mongoose | VS Code          |
| Bootstrap      | CORS     | MongoDB Compass | Git & GitHub |

---

## 📁 Folder Structure

```
employee-management/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
```

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Vinod-Rajapaksha/Employee-Management-System.git
cd Employee-Management-System
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URL=mongodb://127.0.0.1:27017/employeeDB
PORT=5000
```

Start the server:
```bash
node server.js
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📦 API Endpoints

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | /employees        | Get all employees     |
| GET    | /employees/:id    | Get employee by ID    |
| POST   | /employees        | Add new employee      |
| PUT    | /employees/:id    | Update employee       |
| DELETE | /employees/:id    | Delete employee       |

---

## 🧪 Testing Tools

- ✅ Postman (API testing)  
- ✅ MongoDB Compass (data viewer)  
- ✅ Browser DevTools (frontend debugging)  

---

## 🎯 Future Enhancements

- 🔐 Admin login with JWT authentication  
- 📸 Upload employee profile pictures 
- 🌐 Deploy on Vercel & Render  
- 📄 Export employee data to PDF/Excel  

---

## 💡 Learning Outcomes

- Understand full-stack architecture using MERN  
- Build RESTful APIs with Express and MongoDB  
- Manage state and props in React  
- Connect frontend to backend using Axios  
- Implement CRUD functionality end-to-end  

---

## 👨‍💻 Author

👨‍💻 **Vinod Rajapaksha**  
📧 vinodrajapaksha.dev@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/vinod-rajapaksha) | [GitHub](https://github.com/Vinod-Rajapaksha)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> 🌱 _Built with passion, learning, and a lot of coffee... ☕_

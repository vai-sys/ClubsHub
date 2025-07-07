# ClubShub - College Clubs Management Platform



## 📌 Overview
ClubShub is a **MERN-stack** based web application designed to **streamline club management** within a college. It allows students to explore clubs, check upcoming events, and participate in competitions while providing role-based access for club leaders and administrators to manage their respective clubs effectively.

## 🎯 Features
- 🔹 **Role-based Access Control (RBAC)**
  - **Student**: View clubs, events, and competitions; register for events.
  - **Club Lead**: Create events for their club, manage club activities.
  - **Faculty Coordinator**: Approve or reject events created by club leads.
  - **Super Admin**: Approve events after faculty coordinator approval, manage the entire system.
- 🔹 **Club & Events Management Workflow**
  - **Club Leads** create an event request.
  - The **Faculty Coordinator** reviews the request and either approves or rejects it.
  - If approved by the **Faculty Coordinator**, the event request is sent to the **Super Admin** for final approval.
  - If the **Super Admin** approves, the event becomes visible to all students.
  - If the **Faculty Coordinator** rejects the request, it does not proceed further.
- 🔹 **Competition Booking System**
- 🔹 **Announcements**
- 🔹 **Track Activity**
- 🔹 **User Authentication & Authorization (JWT-based)**
- 🔹 **Real-time Updates & Notifications**



## 🛠️ Tech Stack
### **Frontend (React.js)**
- React.js (Vite for fast development)
- React Router for navigation
- Tailwind CSS for styling

### **Backend (Node.js & Express.js)**
- Express.js for API development
- JWT for authentication
- MongoDB + Mongoose for database management



## 📦 Installation & Setup
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/vai-sys/ClubsHub.git
cd ClubsHub
```

### **2️⃣ Install Dependencies**
#### Backend Setup:
```bash
cd backend
npm install
```
#### Frontend Setup:
```bash
cd frontend
npm install
```

### **3️⃣ Setup Environment Variables**
Create a `.env` file in the backend root directory and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=port
```

### **4️⃣ Run the Application**
#### Start Backend Server:
```bash
cd backend
npm start
```
#### Start Frontend Server:
```bash
cd frontend
npm run dev
```

## 🔒 Role-Based Access & Dashboard Overview
| Role | Dashboard & Permissions |
|------|-------------------------|
| **Student** | View clubs, events, competitions, register for events |
| **Club Lead** | Create events, manage club activities |
| **Faculty Coordinator** | Review and approve/reject events from club leads |
| **Super Admin** | Final approval for events, manage all users, clubs, and events |

## Project is Live at https://clubs-hub.vercel.app/
   - login as Student : rutujabagad@gmail.com
   - login as clubAdmin :varadpawar@gmail.com
   - login as FacultCoordinater : nilesh@gmail.com
   - login as SuperAdmin :kavitamoholkar@gmail.com

## 📌 Future Enhancements
- 📢 **Push Notifications for Event Updates**
- 📆 **Google Calendar Integration**
- 📊 **Analytics Dashboard for Clubs**
  - **Event Attendance Tracking**
  - **Club Performance Metrics**
  - **User Engagement Insights**



## 📜 License
This project is open-source under the **MIT License**.

## 👨‍💻 Contributing
Feel free to fork and contribute! Create a pull request with your changes.

---
### 💡 Need Help?
For issues or feature requests, raise an issue on [GitHub](https://github.com/vai-sys/ClubsHub).



![Screenshot 2025-02-15 151502](https://github.com/user-attachments/assets/f40c7fd4-96f7-4639-8b98-77c639227ecf)
![Screenshot 2025-02-15 151522](https://github.com/user-attachments/assets/e4ef6d3b-971c-440e-b41c-d45960b0c89f)

![Screenshot 2025-02-15 151607](https://github.com/user-attachments/assets/eb273d7c-a7b4-46de-95d5-1e67c3b87ca7)
![Screenshot 2025-02-15 151631](https://github.com/user-attachments/assets/5cd3a4ac-ad17-4197-bbc8-637c517e6319)

![Screenshot 2025-02-15 151659](https://github.com/user-attachments/assets/62bb0b04-9913-41c3-aeac-0b7afb92647d)


![Screenshot 2025-02-15 151844](https://github.com/user-attachments/assets/16bd80eb-011b-4203-9151-3cd67f54855a)

![Screenshot 2025-02-15 151731](https://github.com/user-attachments/assets/a9dc9c99-27b8-4ce3-b639-9f553e29d807)
![Screenshot 2025-02-15 151825](https://github.com/user-attachments/assets/d5fb3c74-27f3-4132-9389-5ea73db25b23)

![Screenshot 2025-02-15 161135](https://github.com/user-attachments/assets/f610f342-a702-4243-8dcd-36e363f13152)



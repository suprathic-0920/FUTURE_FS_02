# 🚀 Client Lead Management System (Mini CRM)

A full-stack Mini CRM application built for managing client leads efficiently. This project features a modern UI with 3D animations, a secure admin login portal, and dynamic database integration for real-time updates. 

**Repository:** `FUTURE_FS_02`

---

## 🔐 Admin Demo Access
To evaluate the dashboard, please use the following credentials on the login page:
* **Email:** `admin@ssltd.com`
* **Password:** `admin123`

---

## ✨ Key Features

* **Glassmorphism Login Portal:** Secure, token-based (simulated) admin authentication system preventing unauthorized dashboard access.
* **Leads Pipeline:** Full CRUD capabilities to seamlessly Add, Review, Update (New / Contacted / Converted), and Delete client leads.
* **Dynamic Transactions List:** Real-time updates in the recent transactions panel based on lead status changes (e.g., automatically records revenue when a lead is marked as 'Converted').
* **Interactive Dashboard Metrics:** Auto-updating statistics and fully responsive conversion method cards.
* **Custom Toast Notifications:** Modern, neon-themed slide-in alerts replacing standard browser prompts for better UX.
* **Premium UI/UX:** Designed with a "Dark Cyberpunk / Glassmorphism" theme, featuring custom cursor trails, splitting 3D text animations, and interactive hover states.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (No external UI frameworks used).
* **Backend:** Node.js, Express.js (RESTful API architecture).
* **Database:** SQLite3 (Lightweight, server-side relational database).
* **Icons:** FontAwesome.

---

## ⚙️ Installation & Setup

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/FUTURE_FS_02.git
   cd FUTURE_FS_02
   \`\`\`

2. **Install backend dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   \`\`\`bash
   npm install express cors sqlite3
   \`\`\`

3. **Start the backend server:**
   \`\`\`bash
   node server.js
   \`\`\`
   *You should see a success message: "🚀 Backend Server is running at http://localhost:3000"*

4. **Launch the Application:**
   Open the `login.html` file in your web browser to start using the CRM!

---

## 🎨 Credits
* **Development & Backend:** Suprathic KGS
* **UI/UX & Theme Concept:** Special thanks to my favorite lead designer for the Premium Dark Blue & Neon Green styling concept! ❤️

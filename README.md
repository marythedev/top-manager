# TopManager

**TopManager** is a lightweight, intuitive task and project management web app built to help users stay organized. It allows users to create projects, assign tasks with deadlines and priorities, and manage their personal workflow securely within a responsive interface that works across devices.

## 🚀 Key Features

* ✅ User authentication (signup/login) with secure password hashing
* 📁 Create and manage multiple projects
* 📝 Add tasks with due dates and priority levels (Low / Medium / High)
* 📊 Track deadlines by project
* 🔒 Session-based authentication & access control
* 📱 Responsive design for desktop and mobile

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with Mongoose)
* **Templating**: Handlebars (hbs)
* **Auth & Security**: bcryptjs, client-sessions
* **Frontend**: CSS, Flexbox, Vanilla JavaScript
* **Deployment**: Vercel
* **Env Management**: `.env` for secure configs

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v19+) & npm  
- MongoDB (local or cloud) with connection URI


### Installation

Clone this repository and install dependencies:
```bash
git clone https://github.com/marythedev/top-manager.git
cd top-manager
npm install
```

Rename `.env.template` file to `.env` and update variables with appropriate values.

Start the server:

```bash
npm start
```

Open `http://localhost:3000` in your browser.

---

## 🧑‍💻 How to Use

1. **Sign Up**: Create your account securely.
2. **Log In**: Login and access your dashboard.
3. **Create Projects**: Organize your work by projects.
4. **Add Tasks**: Set priority, due dates and assign tasks to projects.
5. **Manage Your Work**: Edit or delete task and projects once completed.
6. **Update Account Info**: Change your password or delete your account.

---

## 📂 Project Structure

```text
TopManager/
│
├── controllers/        # Business logic for users, projects, tasks
├── model/              # Mongoose schemas
├── routes/             # Express route handlers
├── views/              # Handlebars templates (UI pages)
├── public/             # Static files (CSS, JS, images)
├── middleware-functions.js  # Auth middleware
├── server.js           # Entry point of the app
└── vercel.json         # Vercel deployment configuration
```

---

## 🔐 Authentication & Security

* Passwords are hashed with `bcryptjs` before storage.
* Session-based login using `client-sessions`.
* Middleware guards restrict access to authenticated routes.
* Users can only view and modify their own data.

---

## 🛡️ Error Handling

* Friendly user-facing messages for common issues (e.g. form validation).
* Generic fallback pages (`oops`, `404`) for unexpected errors.
* Controller-level handling of database and logic exceptions.

---

## 🤝 Contact

Designed and developed by [**@marythedev**](https://www.linkedin.com/in/marythedev/).  
Questions or suggestions? Use the [**Contact Us**](https://top-manager.vercel.app/contact) page within the app.

Here is the **complete `README.md` file** in **one single block** — just copy and paste it into your project root:

```markdown
# ERP System

A full-stack Enterprise Resource Planning (ERP) application with a **Node.js/Express backend** and **React (Vite + Tailwind CSS) frontend**.

---

## Features

### Backend
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Password hashing with `bcryptjs`
- File uploads via multer
- Input validation with `zod`
- CORS enabled
- Global error handling with `express-async-errors`

### Frontend
- React 19 + Vite
- State management: TanStack React Query
- Forms: React Hook Form + Zod
- Styling: Tailwind CSS 
- Data Grid: AG Grid
- Routing: React Router DOM
- Context Api for state management

---

## Project Structure

```
erp-mern/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

> **Note**: You already have `.env` files in both `backend/` and `frontend/`.

---

## Setup Guide

### 1. Clone & Navigate

```bash
git clone https://github.com/yourusername/erp-mern.git
cd erp-mern
```

---

### 2. Backend Setup

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Environment Variables (already in `.env`)

Ensure your `backend/.env` contains:

```env
PORT=5000
MONGODB_URI=mongodb+srv://kkausik11_db_user:wlc7m9uZisbKmwxb@cluster0.udzkxq7.mongodb.net/?appName=Cluster0
JWT_ACCESS_SECRET=b6c9a8a4f8b5e3b3d3b7e4c9d2f9e5b6b9c2a8a9e8f1d3c7f3e4d2f8e1a7b9c3
JWT_REFRESH_SECRET=9f3e1b2c7a5d9c8e4f7b2a3d6e9c0f1a2b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d


```

#### Run Backend

**Development (with auto-restart):**
```bash
yarn dev (as because i am using nodemon to run the project)
```



> **Backend should runs on**: `http://localhost:5000`

---

### 3. Frontend Setup

Open a **new terminal** and run:

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Environment Variables (already in `.env`)

Ensure `frontend/.env` contains:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Important**: Use `VITE_` prefix so it's exposed to the browser.

#### Run Frontend

```bash
npm run dev
```

> **Frontend should runs on**: `http://localhost:5173`

---

## Scripts

### Backend

| Script       | Command             | Description                     |
|--------------|---------------------|---------------------------------|
| `dev`        | `yarn dev`       | Run with nodemon (auto-restart) |
| `start`      | `npm start`         | Run in production               |
| `test`       | `npm test`          | Run Jest tests                  |

### Frontend

| Script       | Command             | Description                     |
|--------------|---------------------|---------------------------------|
| `dev`        | `npm run dev`       | Start Vite dev server           |
| `build`      | `npm run build`     | Build for production            |
| `preview`    | `npm run preview`   | Preview production build        |
| `lint`       | `npm run lint`      | Run ESLint                      |

---

## API Base URL

Frontend communicates with backend at:

```
http://localhost:5000/api
```

Configured via `VITE_API_BASE_URL` in `frontend/.env`

---

## Example API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/auth/login`   | User login               |
| POST   | `/api/auth/register`| Register new user        |
| GET    | `/api/users`        | Get all users (auth)     |
| POST   | `/api/upload`       | Upload image to Cloudinary |

---



## Tech Stack

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- multer
- Zod

### Frontend
- React 19
- Vite
- Tailwind CSS
- AG Grid
- React Query
- React Hook Form
- Axios
- Context api for state management

---

## Ports Summary

| Service  | Port           | URL                        |
|----------|----------------|----------------------------|
| Backend  | `5000`         | `http://localhost:5000`    |
| Frontend | `5173`         | `http://localhost:5173`    |

---

## Contributing

1. Fork the repo
2. Create branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

---

## License

MIT License

```
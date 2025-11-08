# ERP Project API Documentation

## Base URLs

* **Frontend:** `http://localhost:5173/`
* **Backend:** `http://localhost:5000/api/`

> **Note:** All protected routes require authentication. Include JWT in the `Authorization` header as `Bearer <token>`.

---

## Table of Contents

- [ERP Project API Documentation](#erp-project-api-documentation)
  - [Base URLs](#base-urls)
  - [Table of Contents](#table-of-contents)
  - [Authentication](#authentication)
  - [Users](#users)
    - [Endpoints](#endpoints)
    - [Example Response for `/users/me`](#example-response-for-usersme)
  - [Clients](#clients)
  - [Projects](#projects)
  - [Tasks](#tasks)
  - [Activities](#activities)
    - [Sample Response](#sample-response)
  - [File Upload](#file-upload)
    - [Request](#request)
    - [Response](#response)
  - [Middleware \& Permissions](#middleware--permissions)

---

## Authentication

| Method | Endpoint              | Description       | Body                              |
| ------ | --------------------- | ----------------- | --------------------------------- |
| POST   | `/auth/register`      | Register new user | `{ name, email, password, role }` |
| POST   | `/auth/login`         | Login user        | `{ email, password }`             |
| POST   | `/auth/refresh-token` | Refresh JWT token | `{ refreshToken }`                |
| POST   | `/auth/logout`        | Logout user       | None (JWT required)               |

---

## Users

### Endpoints

| Method | Endpoint            | Description                      | Role/Permission |
| ------ | ------------------- | -------------------------------- | --------------- |
| GET    | `/users/me`         | Get current user info            | Authenticated   |
| POST   | `/users`            | Create a new user                | Admin           |
| GET    | `/users`            | List users (search & pagination) | Admin, Manager  |
| GET    | `/users/:id`        | Get a single user by ID          | Admin, Manager  |
| PUT    | `/users/:id`        | Update user info                 | Admin           |
| DELETE | `/users/:id`        | Soft delete user                 | Admin           |
| PATCH  | `/users/:id/grant`  | Grant permissions                | Admin, Manager  |
| PATCH  | `/users/:id/revoke` | Revoke permissions               | Admin, Manager  |

### Example Response for `/users/me`

```json
{
  "user": {
    "id": "123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Employee",
    "permissions": ["canCreateTask", "canViewProject"]
  }
}
```

---

## Clients

| Method | Endpoint       | Description      | Role/Permission |
| ------ | -------------- | ---------------- | --------------- |
| GET    | `/clients`     | Get all clients  | Authenticated   |
| POST   | `/clients`     | Create client    | Admin, Manager  |
| GET    | `/clients/:id` | Get client by ID | Authenticated   |
| PUT    | `/clients/:id` | Update client    | Admin, Manager  |
| DELETE | `/clients/:id` | Delete client    | Admin, Manager  |

---

## Projects

| Method | Endpoint                    | Description       | Role/Permission                     |
| ------ | --------------------------- | ----------------- | ----------------------------------- |
| GET    | `/projects`                 | Get all projects  | Authenticated                       |
| POST   | `/projects`                 | Create project    | Admin, Manager + `canCreateProject` |
| GET    | `/projects/:id`             | Get project by ID | Authenticated                       |
| PUT    | `/projects/:id`             | Update project    | Admin, Manager                      |
| DELETE | `/projects/:id`             | Delete project    | Admin, Manager                      |
| POST   | `/projects/:id/attachments` | Upload attachment | Authenticated                       |

---

## Tasks

| Method | Endpoint                         | Description               | Role/Permission                  |
| ------ | -------------------------------- | ------------------------- | -------------------------------- |
| GET    | `/projects/:projectId/tasks`     | Get all tasks for project | Authenticated                    |
| POST   | `/projects/:projectId/tasks`     | Create task               | Admin, Manager + `canCreateTask` |
| GET    | `/projects/:projectId/tasks/:id` | Get single task           | Authenticated                    |
| PUT    | `/projects/:projectId/tasks/:id` | Update task               | Admin, Manager                   |
| DELETE | `/projects/:projectId/tasks/:id` | Delete task               | Admin, Manager                   |

---

## Activities

| Method | Endpoint      | Description           | Role/Permission |
| ------ | ------------- | --------------------- | --------------- |
| GET    | `/activities` | Get all activity logs | Authenticated   |

### Sample Response

```json
[
  {
    "_id": "123",
    "user": { "name": "Admin User" },
    "action": "Admin User updated",
    "target": "User: John Doe",
    "details": "role: Employee → Manager | permissions updated",
    "createdAt": "2025-11-07T18:25:43.511Z"
  }
]
```

---

## File Upload

| Method | Endpoint  | Description          | Role/Permission |
| ------ | --------- | -------------------- | --------------- |
| POST   | `/upload` | Upload a single file | Authenticated   |

### Request

* Multipart/form-data with key: `file`

### Response

```json
{
  "success": true,
  "message": "File uploaded",
  "data": {
    "url": "https://res.cloudinary.com/youraccount/filename",
    "public_id": "filename"
  }
}
```

---

## Middleware & Permissions

* **protect:** Ensures the user is authenticated (JWT token).
* **authorize(roles):** Checks if the user role matches `Admin`, `Manager`, etc.
* **checkPermission(permission):** Checks specific action permission, e.g., `canCreateProject`.
* **errorHandler:** Global error handler to catch server errors.

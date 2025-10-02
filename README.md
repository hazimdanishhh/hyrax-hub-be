# 🧮 Hyrax Hub Backend

A backend system for Hyrax Oil's web application, an ERP-like system with microservice flexibility.

Frontend: [Hyrax Hub FE](https://github.com/hazimdanishhh/hyrax-hub-fe)

---

## 📚 Table of Contents

- [🧮 Hyrax Hub Backend](#-hyrax-hub-backend)
  - [📚 Table of Contents](#-table-of-contents)
  - [📦 Tech Stack](#-tech-stack)
  - [🚀 Features](#-features)
  - [🧰 Installation \& Setup](#-installation--setup)
  - [🧪 API Overview](#-api-overview)
  - [📝 Test Cases](#-test-cases)
  - [🗂 Folder Structure](#-folder-structure)
  - [⚙️ Environment Variables](#️-environment-variables)
  - [📌 Future Improvements](#-future-improvements)
  - [👤 Authors](#-authors)
  - [📝 License](#-license)

---

## 📦 Tech Stack

- **Node.js** + **Express** (Backend API)
- **MongoDB** with **Mongoose** (Database & ODM)
- **JWT Auth** (Access control)
- **Modular MVC Architecture**
- Built for internal use with clear roles

---

## 🚀 Features

- User authentication (JWT-based)
- Role-based access control
- Create/Edit/Delete project costings
- Dynamic service item selection with hourly rates
- Auto-calculated subtotals and total costing
- Full API structure for future frontend integration
- Modular folder structure using services, controllers, models

---

## 🧰 Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/hazimdanishhh/hyrax-hub-be
   cd hyrax-hub-be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Create a `.env` file:

   - Ensure `CLIENT_ORIGIN` does not have a trailing slash "/".

   ```env
   PORT=5000

   JWT_SECRET_ACCESS=your_secret_key
   JWT_SECRET_REFRESH=your_secret_key
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name

   NODE_ENV=development

   CLIENT_ORIGIN=front_end_url_without_trailing_slash
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

---

## 🧪 API Overview

> API Routes & Middleware -> [routes-&-middleware](./docs/routes-overview.md)

**Main Endpoints:**

| Method | Route                | Description                | Auth       |
| ------ | -------------------- | -------------------------- | ---------- |
| POST   | `/api/auth/register` | Register a new user        | ❌         |
| POST   | `/api/auth/login`    | Login user                 | ❌         |
| GET    | `/api/costings`      | Get all costings (by user) | ✅         |
| POST   | `/api/costings`      | Create a new costing       | ✅         |
| PUT    | `/api/costings/:id`  | Update existing costing    | ✅         |
| DELETE | `/api/costings/:id`  | Delete a costing           | ✅         |
| GET    | `/api/services`      | List of all service items  | ✅         |
| POST   | `/api/services`      | Create a service item      | ✅ (Admin) |

---

## 📝 Test Cases

> Full Postman Test Cases -> [test-cases](./docs/postman-test-cases.md)

---

## 🗂 Folder Structure

```bash
src/
├── controllers/        # Request handlers
├── services/           # Business logic
├── models/             # Mongoose schemas
├── routes/             # API route definitions
├── middleware/         # Auth, error handlers
├── utils/              # Helpers (e.g. token, validation)
├── config/             # DB and env config
├── index.js            # App entrypoint
```

---

## ⚙️ Environment Variables

| Variable                 | Required | Description                                                               |
| ------------------------ | -------- | ------------------------------------------------------------------------- |
| `PORT`                   | ✅       | Server port                                                               |
| `JWT_SECRET_ACCESS`      | ✅       | Your JWT Secret Key                                                       |
| `JWT_SECRET_REFRESH`     | ✅       | Your JWT Secret Key                                                       |
| `JWT_ACCESS_EXPIRES_IN`  | ✅       | JWT Expiry                                                                |
| `JWT_REFRESH_EXPIRES_IN` | ✅       | JWT Expiry                                                                |
| `DB_HOST`                | ✅       | Your Database Host                                                        |
| `DB_USER`                | ✅       | Your Database User                                                        |
| `DB_PASS`                | ✅       | Your Database Password                                                    |
| `DB_NAME`                | ✅       | Your Database Name                                                        |
| `NODE_ENV`               | ✅       | Node Environment                                                          |
| `CLIENT_ORIGIN`          | ✅       | Front End URL (Ensure `CLIENT_ORIGIN` does not have a trailing slash "/") |

---

## 📌 Future Improvements

- PDF export of costings
- Email sending feature
- Admin dashboard with stats
- Role-based service item editing
- Frontend integration (React SSR)

---

## 👤 Authors

- [@danish](https://github.com/hazimdanishhh)
- Rangka Empat Studio

---

## 📝 License

MIT License

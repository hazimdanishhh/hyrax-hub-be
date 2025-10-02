# 🤖 AGENTS.md - Version 1.0.0

[**View Changelog**](/CHANGELOG.md)

---

## 🎯 Purpose

This document defines the blueprint for building a secure, enterprise-grade, modular web application: a React frontend with SCSS styling, Framer Motion animations, Axios for API calls, and React Context for state/auth; a Node.js + Express backend using Sequelize with MySQL; and a session-tracked JWT authentication/authorization system. It defines the **philosophy, best practices, and technical decisions** that must guide development to ensure **scalability, security, maintainability, and clarity**. It outlines a detailed relational database schema for a core module and HR module, specifies file-storage strategy (object storage such as S3/R2), enforces strong security practices (bcrypt password hashing, CORS, HTTPS, centralized role/permission checks), and prescribes a clean MVC-style folder structure, CI/CD via GitHub Actions, environment-specific deployments (Render staging → Hostinger VPS production), and testing workflows. The philosophy centers on scalability, modularity, and future-proofing, ensuring the platform can grow into a multi-department, ERP-like system with microservice flexibility and clear developer alignment.

- Building an enterprise-grade web application
- Will be scalable
- Will implement features in phases
- Will have secure authentication

---

## 🏗️ Core Principles

1. **Best Practice First** – Always follow established, enterprise-grade standards before shortcuts.
2. **Security by Default** – Authentication, authorization, validation, and encryption are non-negotiable.
3. **Scalable & Modular** – Design so features, roles, or systems can expand without rewrites.
4. **Reusable & Consistent** – Build components, APIs, and structures once, use everywhere.
5. **Developer Clarity** – Code must be self-explanatory and documented for small-team collaboration.
6. **Future-Proofing** – Choose tools and patterns that are widely adopted and unlikely to become obsolete soon.

---

## ⚙️ Tech Stack

### **Frontend**

- Framework: **React**
- Styling: **SCSS**
- Animations: **Framer Motion**
- API Calls: **Axios with interceptors**
- State/Auth: **React Context (AuthContext)** for authentication & session handling
- Deployment: **Hostinger (Frontend)**

### **Backend**

- Framework: **Node.js + Express**.
- ORM: **Sequelize (MySQL)**.
- Auth: **JWT (Access + Refresh rotation) with Session tracking in DB**.
- Middleware: Separate `authenticateUser`, `authorizeAccess`, `authorizeAdmin`, etc.
- Deployment: **Render (Staging)** → **Hostinger VPS (Production)**.

### **Database**

- **MySQL** (preferred over MongoDB for structured, relational, multi-module ERP-style apps).
- Hosted on same VPS or dedicated managed DB (future scaling).

#### Tables

##### Core Module

| Table             | Fields                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **users**         | id (PK), name, username, email, passwordHash, role (`admin`, `director`, `manager`,`staff`), status (`active`, `inactive`, `suspended`), lastLoginAt, createdAt, updatedAt          |
| **permissions**   | id (PK), userId (FK), moduleId (FK), featureId (FK), accessLevel (`create`, `read`, `update`, `delete`), scope (`all`, `department`, `self`), grantedBy (FK to users.id), createdAt |
| **modules**       | id (PK), name, code (short unique), description, is_core (boolean), created_at                                                                                                      |
| **features**      | id (PK), module_id (FK), name, code, description, created_at                                                                                                                        |
| **notifications** | id (PK), user_id (FK), title, message, type (`info`, `warning`, `error`, `success`), read_status (boolean), created_at, read_at                                                     |
| **audit_logs**    | id (PK), user_id (FK), module_id (FK), feature_id (FK), action, target_id, target_type, details (JSON), created_at                                                                  |
| **settings**      | id (PK), key, value, description, created_at, updated_at                                                                                                                            |
| **attachments**   | id (PK), uploaded_by (FK), module_id (FK), feature_id (FK), file_name, file_path, file_type, size, created_at                                                                       |
| **sessions**      | id (PK), user_id (FK), refresh_token, ip_address, user_agent, expires_at, revoked_at, created_at                                                                                    |

##### HR Module

| Table                  | Fields                                                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **departments**        | id (PK), name, code, description, created_at                                                                                                                                     |
| **positions**          | id (PK), department_id (FK), title, description, created_at                                                                                                                      |
| **employees**          | id (PK), user_id (FK, nullable), department_id (FK), position_id (FK), employee_code, hire_date, employment_status (`active`, `on_leave`, `terminated`), created_at              |
| **employee_details**   | id (PK), employee_id (FK), date_of_birth, gender, phone, address, emergency_contact_name, emergency_contact_phone, national_id, tax_number, bank_account, created_at, updated_at |
| **employee_documents** | id (PK), employee_id (FK), file_name, file_path, file_type, uploaded_by (FK), created_at                                                                                         |
| **leave_requests**     | id (PK), employee_id (FK), leave_type (`annual`, `sick`…), start_date, end_date, reason, status (`pending`, `approved`, `rejected`), approved_by (FK to users.id), created_at    |
| **attendance_records** | id (PK), employee_id (FK), date, check_in_time, check_out_time, status (`present`, `absent`, `late`, `on_leave`), created_at                                                     |

### **Storage**

- File uploads stored in **object storage**, not DB.
- Options: AWS S3, Google Cloud Storage, Cloudflare R2, DigitalOcean Spaces.
- Current strategy: Evaluate free/low-cost tier (Cloudflare R2 or AWS S3 likely best).
- Currently: Not implemented yet, haven't chosen or tested any options.

---

## 🔑 Authentication & Authorization

- **Access Token (short-lived)** + **Refresh Token (rotated)**.
- **Sessions table** in DB ties tokens to users for traceability & revocation.
- `/api/users/me` endpoint is **mandatory** for current user profile retrieval.
- `/:id` endpoints are guarded:

  - **Admin only** for sensitive fields.
  - **Self-access** allowed for personal updates/deletes.
  - Optional **public profile mode** (for "social media style" employee directory).

---

## 📂 File Structure Guidelines

- **Controllers**: Handle request/response only.
- **Services**: Business logic (separation of concerns).
- **Models**: Sequelize models only.
- **Routes**: Clean, minimal, import controllers.
- **Middlewares**: Authentication, validation, logging, access control.
- **Config**: DB, env, logging, security constants.

---

## 🚨 Security Standards

- **Never trust client input** – always validate/sanitize on backend.
- **Password storage**: bcrypt with strong salt rounds.
- **CORS** properly configured (frontend domain whitelisted).
- **HTTPS only** in production.
- **Role & Permission checks** at backend level (never frontend-only).
- **Tokens** always stored in **HTTP-only cookies or secure storage**, not localStorage (long-term plan).

---

## 📈 Scalability & Future-Proofing

- Multi-department, multi-module ERP-like architecture is the long-term target.
- Features like user directories, employee profiles, costing/quotation tools, etc. must be **modularized**.
- Future ability to:

  - Add new departments (HR, Sales, Finance, etc.).
  - Plug in microservices if needed.
  - Switch cloud providers without rewriting core logic.

---

## 🧪 Testing & Validation

- **Postman** for manual API testing.
- Centralized **test cases JSON** for consistency across environments.
- Unit tests for core services (long-term goal).

---

## 🛠️ Development Workflow

- **Environment parity**: `.env` files for local, staging, production.
- **Staging (Render free tier)** → **Production (Hostinger VPS or any relevant, reliable VPS provider)**.
- **CI/CD**: GitHub Actions.
- **Documentation-first**: All major changes updated in API repo.

---

## ✅ Non-Negotiables

- Always **use ES Modules**, never CommonJS.
- Keep auth/session logic **centralized and consistent**.
- No sensitive secrets in codebase.
- All new features must respect **modularity** (controller-service separation).
- **Agents and humans must stay aligned with this file** at all times.

---

## Suggested Additions / Improvements

1. **Versioning & Change Log** – Add a section describing how updates to this file are tracked (e.g., semantic versioning, CHANGELOG.md) so humans/agents can stay aligned.
2. **API Design Guidelines** – Brief REST/GraphQL conventions (naming, error format, pagination) to maintain consistency.
3. **Coding Standards** – Linting/formatting rules (ESLint, Prettier), commit message style (Conventional Commits).
4. **Monitoring & Observability** – Plans for logging, metrics, alerting (e.g., Winston, PM2, Sentry, OpenTelemetry).
5. **Deployment & Scaling Strategy** – Brief notes on horizontal scaling, load balancers, and backup/DR strategy for database and object storage.
6. **Performance & Caching** – Guidelines for query optimization, use of Redis or CDN if traffic grows.
7. **Accessibility & UX** – High-level commitment to WCAG compliance and responsive design standards.
8. **Testing Roadmap** – Specify unit/integration testing frameworks (Jest, Supertest) and code-coverage targets.

---

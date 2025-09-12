# 🤖 AGENTS.md

- Building an enterprise-grade web application
- Will be scalable
- Will implement features in phases
- Will have secure authentication

## 🎯 Purpose

This document exists to keep alignment between developer(s) and AI agents when building and scaling our internal and client-facing applications. It defines the **philosophy, best practices, and technical decisions** that must guide development to ensure **scalability, security, maintainability, and clarity**.

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

- Framework: **React** (SPA now, migrating toward SSR with Vike if needed).
- Styling: **TailwindCSS**, SCSS (legacy).
- Animations: **Framer Motion**.
- API Calls: **Axios with interceptors**.
- State/Auth: **React Context (AuthContext)** for authentication & session handling.
- Deployment: **Hostinger (Frontend)**.

### **Backend**

- Framework: **Node.js + Express (ES Modules)**.
- ORM: **Sequelize (MySQL)**.
- Auth: **JWT (Access + Refresh rotation) with Session tracking in DB**.
- Middleware: Separate `authenticateUser`, `authorizeAccess`, `authorizeAdmin`, etc.
- Deployment: **Render (Staging)** → **Hostinger VPS (Production)**.

### **Database**

- **MySQL** (preferred over MongoDB for structured, relational, multi-module ERP-style apps).
- Hosted on same VPS or dedicated managed DB (future scaling).

### **Storage**

- File uploads stored in **object storage**, not DB.
- Options: AWS S3, Google Cloud Storage, Cloudflare R2, DigitalOcean Spaces.
- Current strategy: Evaluate free/low-cost tier (Cloudflare R2 or AWS S3 likely best).

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
- **Staging (Render free tier)** → **Production (Hostinger VPS)**.
- **CI/CD (future)**: GitHub Actions or similar.
- **Documentation-first**: All major changes updated in Dev Docs repo.

---

## ✅ Non-Negotiables

- Always **use ES Modules**, never CommonJS.
- Keep auth/session logic **centralized and consistent**.
- No sensitive secrets in codebase.
- All new features must respect **modularity** (controller-service separation).
- **Agents and humans must stay aligned with this file** at all times.

---

Would you like me to **embed an explicit "decision log" section** inside AGENTS.md too? (e.g., _Why MySQL over MongoDB_, _Why VPS over shared hosting_, _Why /me endpoint is needed_, etc.) That way, future you (or anyone joining) can see **why** decisions were made, not just what they are.

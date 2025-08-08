# Database Architecture

- Scalable: Core never depends on HR tables; HR can evolve without touching Core.
- Modular: You can drop in/out modules without schema breaking.
- Efficient: Minimal but necessary FKs keep joins intentional, not bloated.
- Secure: Sensitive PII stored in employee_details with its own access layer.
- Flexible: Supports employees without logins; supports users without HR profiles.

## Core Module Old

| Table             | Fields                                                                                                                                                                                    | Purpose & Notes                                                                                    | Relations                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **users**         | id (PK), name, username, email, password_hash, role (`admin` / `user`), department_id (FK), status (`active`, `inactive`, `suspended`), created_at, updated_at, last_login_at             | Stores all platform accounts. Department link is optional if the user is system-level admin.       | department_id → departments.id                                           |
| **permissions**   | id (PK), user_id (FK), module_id (FK), feature_id (FK), access_level (`create`, `read`, `update`, `delete`), scope (`all`, `department`, `self`), granted_by (FK to users.id), created_at | Defines **fine-grained access control** for each user per feature. Scope lets us limit access.     | user_id → users.id; module_id → modules.id; feature_id → features.id     |
| **modules**       | id (PK), name, code (short unique string), description, is_core (boolean), created_at                                                                                                     | Represents a major system area (Core, HR, Sales, Finance). The `code` is for internal referencing. | None directly dependent; linked via features & permissions               |
| **features**      | id (PK), module_id (FK), name, code, description, created_at                                                                                                                              | Breaks a module into specific actions/pages (e.g., “Create Employee”, “Edit Department”).          | module_id → modules.id                                                   |
| **notifications** | id (PK), user_id (FK), title, message, type (`info`, `warning`, `error`, `success`), read_status (boolean), created_at, read_at                                                           | For user-facing system alerts/messages.                                                            | user_id → users.id                                                       |
| **audit_logs**    | id (PK), user_id (FK), module_id (FK), feature_id (FK), action, target_id, target_type, details (JSON), created_at                                                                        | Tracks every important action for compliance/debugging.                                            | user_id → users.id; module_id → modules.id; feature_id → features.id     |
| **settings**      | id (PK), key, value, description, created_at, updated_at                                                                                                                                  | Global config table for system-wide settings (e.g., company name, theme).                          | No direct FK                                                             |
| **attachments**   | id (PK), uploaded_by (FK), module_id (FK), feature_id (FK), file_name, file_path, file_type, size, created_at                                                                             | Centralized file management for any module.                                                        | uploaded_by → users.id; module_id → modules.id; feature_id → features.id |

## HR Module Old

| Table                  | Fields                                                                                                                                                                             | Purpose & Notes                                                                         | Relations                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **departments**        | id (PK), name, code, description, created_at                                                                                                                                       | Groups employees/users logically.                                                       | None directly, but linked to users & employees     |
| **employees**          | id (PK), user_id (FK), department_id (FK), employee_code, job_title, hire_date, employment_status (`active`, `on_leave`, `terminated`), created_at                                 | Links HR-specific info to a user account. Keeps `users` table clean.                    | user_id → users.id; department_id → departments.id |
| **employee_details**   | id (PK), employee_id (FK), date_of_birth, gender, phone, address, emergency_contact_name, emergency_contact_phone, national_id, tax_number, bank_account, created_at, updated_at   | Extended employee profile data. Keeps sensitive data separate for security/permissions. | employee_id → employees.id                         |
| **leave_requests**     | id (PK), employee_id (FK), leave_type (`annual`, `sick`, etc.), start_date, end_date, reason, status (`pending`, `approved`, `rejected`), approved_by (FK to users.id), created_at | Leave management.                                                                       | employee_id → employees.id; approved_by → users.id |
| **attendance_records** | id (PK), employee_id (FK), date, check_in_time, check_out_time, status (`present`, `absent`, `late`, `on_leave`), created_at                                                       | Tracks attendance for payroll/performance.                                              | employee_id → employees.id                         |

---

## Core Module New

| Table             | Fields                                                                                                                                                                                    | Purpose & Notes                                                         | Relations / FK Justification                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **users**         | id (PK), name, username, email, password_hash, role (`admin`, `user`, `manager`, etc.), status (`active`, `inactive`, `suspended`), created_at, updated_at, last_login_at                 | Authentication & identity only. **No HR fields** to keep Core modular.  | No FK to departments — keeps Core independent of HR.                                                                     |
| **permissions**   | id (PK), user_id (FK), module_id (FK), feature_id (FK), access_level (`create`, `read`, `update`, `delete`), scope (`all`, `department`, `self`), granted_by (FK to users.id), created_at | Fine-grained feature access. `scope` lets you filter by data ownership. | FK to `users` for who has access, FK to `modules` & `features` for what they can access, FK to `users` for `granted_by`. |
| **modules**       | id (PK), name, code (short unique), description, is_core (boolean), created_at                                                                                                            | Top-level functional areas (Core, HR, Sales…).                          | No FK — modules are independent definitions.                                                                             |
| **features**      | id (PK), module_id (FK), name, code, description, created_at                                                                                                                              | Specific actions/pages within a module.                                 | FK to `modules` — ties each feature to its parent module.                                                                |
| **notifications** | id (PK), user_id (FK), title, message, type (`info`, `warning`, `error`, `success`), read_status (boolean), created_at, read_at                                                           | Per-user system messages.                                               | FK to `users` — because notifications are delivered to a specific account.                                               |
| **audit_logs**    | id (PK), user_id (FK), module_id (FK), feature_id (FK), action, target_id, target_type, details (JSON), created_at                                                                        | Tracks important actions for compliance/security.                       | FKs to `users`, `modules`, and `features` — logs always tied to a user + the feature/module where it happened.           |
| **settings**      | id (PK), key, value, description, created_at, updated_at                                                                                                                                  | Stores global config (e.g., company name, theme).                       | No FK — settings are system-wide.                                                                                        |
| **attachments**   | id (PK), uploaded_by (FK), module_id (FK), feature_id (FK), file_name, file_path, file_type, size, created_at                                                                             | Centralized file store for any module.                                  | FK to `users` (uploader), FK to `modules` and `features` to track where the file belongs.                                |

## HR Module New

| Table                  | Fields                                                                                                                                                                           | Purpose & Notes                                                            | Relations / FK Justification                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **departments**        | id (PK), name, code, description, created_at                                                                                                                                     | Logical grouping of employees.                                             | No FK to `users` — keeps HR optional.                                                            |
| **employees**          | id (PK), user_id (FK, nullable), department_id (FK), employee_code, job_title, hire_date, employment_status (`active`, `on_leave`, `terminated`), created_at                     | Primary HR record. `user_id` nullable to allow employees without accounts. | FK to `users` (optional, to link system account), FK to `departments` for org structure.         |
| **employee_details**   | id (PK), employee_id (FK), date_of_birth, gender, phone, address, emergency_contact_name, emergency_contact_phone, national_id, tax_number, bank_account, created_at, updated_at | Sensitive extended profile.                                                | FK to `employees` — 1:1 relationship keeps PII separate and secured.                             |
| **leave_requests**     | id (PK), employee_id (FK), leave_type (`annual`, `sick`…), start_date, end_date, reason, status (`pending`, `approved`, `rejected`), approved_by (FK to users.id), created_at    | Leave tracking.                                                            | FK to `employees` (requester), FK to `users` (approver) — because approvers are system accounts. |
| **attendance_records** | id (PK), employee_id (FK), date, check_in_time, check_out_time, status (`present`, `absent`, `late`, `on_leave`), created_at                                                     | Tracks daily attendance.                                                   | FK to `employees` — attendance belongs to an employee, not directly to a `user`.                 |

## Relationship Map

### Core Module

```bash
users -< permissions
users -< notifications
users -< audit_logs

modules -< features
features -< permissions
```

users has no direct link to departments — that link exists only if HR is installed.

### HR Module

```bash
departments -< employees
employees -< employee_details (1:1)
employees (optional) -> users  // employees.user_id -> users.id

```

## FK List

```bash
permissions.user_id -> users.id
permissions.feature_id -> features.id
permissions.module_id -> modules.id
permissions.granted_by -> users.id

features.module_id -> modules.id

notifications.user_id -> users.id

audit_logs.user_id -> users.id
audit_logs.module_id -> modules.id
audit_logs.feature_id -> features.id

attachments.uploaded_by -> users.id
attachments.module_id -> modules.id
attachments.feature_id -> features.id

employees.user_id -> users.id  (nullable, optional link)
employees.department_id -> departments.id

employee_details.employee_id -> employees.id

leave_requests.employee_id -> employees.id
leave_requests.approved_by -> users.id

attendance_records.employee_id -> employees.id

```

import Department from "./department.model";
import Role from "./role.model";
import Session from "./session.model";
import User from "./user.model";

// Association: 1 User → 1 Role
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId", as: "user" });

// Association: 1 User → 1 Department
User.belongsTo(Department, { foreignKey: "departmentId", as: "department" });
Department.hasMany(User, { foreignKey: "departmentId", as: "user" });

// Association: 1 User → Many Sessions
User.hasMany(Session, { foreignKey: "userId", as: "session" });
Session.belongsTo(User, { foreignKey: "userId", as: "user" });

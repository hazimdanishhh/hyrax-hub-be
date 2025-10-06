// permission.middleware.js

/**
 * Permission middleware
 * @param {("self"|"department"|"all")} scope - Level of data access
 * @param {string} department - Department code (e.g., "sales", "hr", "*" for any)
 * @param {number} minRoleRank - Minimum rank required (higher = more privileged)
 */

export function permission(scope, department = "*", minRoleRank = 1) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role || !user.department) {
      return res
        .status(401)
        .json({ error: "Unauthorized or misconfigured user" });
    }

    const userRank = user.role.rank;

    // Always allow admin (highest rank)
    if (user.role.name.toLowerCase() === "admin") {
      req.scope = "all";
      return next();
    }

    // Check role rank
    if (userRank < minRoleRank) {
      return res.status(403).json({ error: "Insufficient role privileges" });
    }

    // Check department (unless wildcard '*')
    if (
      department !== "*" &&
      user.department.name.toLowerCase() !== department.toLowerCase()
    ) {
      return res.status(403).json({ error: "Access restricted to department" });
    }

    // Set scope for controller use
    req.scope = scope;

    return next();
  };
}

/**
 * Role-Based Access Control middleware.
 * Usage: router.post("/", auth, authorize("admin", "staff"), handler)
 *
 * @param  {...string} roles  Allowed roles (e.g. "admin", "staff", "user")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }
    next();
  };
};

module.exports = authorize;

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === "Admin" || req.user.role === "Manager") return next();
    if (!req.user.permissions[permission]) {
      return res.status(403).json({ success: false, message: "Permission denied" });
    }
    next();
  };
};
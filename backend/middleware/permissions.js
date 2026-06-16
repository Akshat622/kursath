module.exports = function checkPermission(permissionType) {
  return (req, res, next) => {
    // If user is not authenticated (req.user is not set by auth middleware)
    if (!req.user) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Main administrator always has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    // Sub-admin permission verification
    if (req.user.role === 'sub-admin') {
      const hasPermission = req.user.permissions && req.user.permissions[permissionType] === true;
      if (hasPermission) {
        return next();
      }
    }

    // Return 403 Forbidden for any failed validation
    return res.status(403).json({ msg: `Access Denied: Insufficient permissions (${permissionType} required)` });
  };
};

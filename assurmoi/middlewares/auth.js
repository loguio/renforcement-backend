const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "assurmoi-secret-key-2026";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized / Invalid Token" });
    if (!decoded.is_active) return res.status(403).json({ error: "Account deactivated" });
    
    req.user = decoded; // { id, role, is_active }
    next();
  });
};

const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Admin always has access to everything
    if (req.user.role === "Administrateur" || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: "Forbidden: insufficient role" });
  };
};

module.exports = { verifyToken, requireRoles, JWT_SECRET };

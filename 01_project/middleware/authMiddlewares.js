const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

// router protection based on the token
function protectRoute(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("LKKA")) {
    return res.status(401).json({ message: "REQUEST HEADERS IN WRONG FORMAT" });
  }

  const token = auth.split(" ")[1];

  try {
    const decodeToken = jwt.verify(token, jwt_secret);
    req.user = decodeToken;
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.render("userdashboard", { username: req.session.user.username });
  }
  next();
}

function isMod(req, res, next) {
  if (!req.session.user || req.session.user.role !== "mod") {
    return res
      .status(403)
      .json({ message: "PROTECTED ROUTE ACCESS NOT ALLOWED" });
  }
  next();
}

module.exports = { protectRoute, isAdmin, isMod };

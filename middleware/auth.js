const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).send("Access denies. no token provided");

  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).send("Access denies. no token provided");

  try {
    const decoded = jwt.verify(token, process.env.jwtKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token .");
  }
};

exports.role = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(401).send("you don't have permission ");
    }
    next();
  };
};

import jwt from "jsonwebtoken";
const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        message: "Authentication required",
        status: 401,
      },
    });
  }

  const token = authorization.substring(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.userId) {
      return res.status(401).json({
        error: {
          message: "Token does not contain user id",
          status: 401,
        },
      });
    }

    req.user = payload;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: {
          message: "Token expired",
          status: 401,
        },
      });
    }

    return res.status(401).json({
      error: {
        message: "Invalid token",
        status: 401,
      },
    });
  }
};

export { requireAuth };

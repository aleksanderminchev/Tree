const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
    if (!token) {
      return res.status(401).json({ status:401,message: "Unauthorized access" });
    }
    console.log(token);
    const { id, exp } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(id);
    req.user = await User.findById(id).select(" password email emailConfirmed orders cart  username phone address firstName lastName role").populate({path:"orders",populate:{path:"items"}}).populate("cart").exec();
    console.log(req.user);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status:401,
        message: "Session has expired, please login to obtain a new one",
      });
    }
    res.status(401).json({ message: "Unauthorized access" });
  }
};

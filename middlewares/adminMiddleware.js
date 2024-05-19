const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (user?.role !== "Admin") {
      return res.status(401).send({
        success: false,
        message: "AUTH Failed",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Auth Failed, Admin API",
      error,
    });
  }
};

const testController = (req, res) => {
  res.status(200).send({
    message: "Test route",
    success: true,
  });
};

module.exports = { testController };

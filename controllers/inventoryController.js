const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req, res) => {
  try {
    const { email, inventoryType } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    if (inventoryType === "in" && user.role !== "Donar") {
      return res.status(404).send({
        success: false,
        message: "Not donar account",
      });
    }
    if (inventoryType === "out" && user.role !== "Hospital") {
      return res.status(404).send({
        success: false,
        message: "Not a hospital",
      });
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    res.status(200).send({
      success: true,
      message: "New blood record added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create inventory api",
      error,
    });
  }
};

const getInventoryController = async (req, res) => {
  //   console.log(req.body.userId);
  try {
    const inventory = await inventoryModel
      .find({
        organization: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all inventory api",
      error,
    });
  }
};

module.exports = { createInventoryController, getInventoryController };

const { default: mongoose } = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // console.log("Inventory: ", req.body);
    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In: ", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //Total out
      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in out calc
      const availableQuantity = totalIn - totalOut;
      //validation
      if (availableQuantity < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantity}ml of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    if (req.body.inventoryType === "in" && user.role !== "Donar") {
      return res.status(404).send({
        success: false,
        message: "Not donar account",
      });
    }
    if (req.body.inventoryType === "out" && user.role !== "Hospital") {
      return res.status(404).send({
        success: false,
        message: "Only hospitals are allowed to OUT blood",
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

//get all blood record
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

//get hospital blood record
const getInventoryHospitalController = async (req, res) => {
  //   console.log(req.body.userId);
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organization")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get consumer inventory api",
      error,
    });
  }
};

//get blood record of 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organization: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Recent inventory data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get consumer inventory api",
      error,
    });
  }
};

// Get donar records
const getDonarController = async (req, res) => {
  try {
    const organization = req.body.userId;
    const donarId = await inventoryModel.distinct("donar", {
      organization,
    });
    // console.log(donarId);
    const donar = await userModel.find({ _id: { $in: donarId } });
    return res.status(200).send({
      success: true,
      message: "Donar record fetched successfully",
      donar,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all donar records",
      error,
    });
  }
};

const getHospitalsController = async (req, res) => {
  try {
    const organization = req.body.userId;
    //get hospital id
    const hospitalId = await inventoryModel.distinct("hospital", {
      organization,
    });
    // console.log(hospitalId);
    //find hospital
    const hospital = await userModel.find({ _id: { $in: hospitalId } });
    return res.status(200).send({
      success: true,
      message: "Hospital record fetched successfully",
      hospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all hospitals records",
      error,
    });
  }
};

const getOrganizationsController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organization", { donar });
    //find org
    const organizations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "Organization record fetched successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all organizations records",
      error,
    });
  }
};
const getOrganizationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organization", { hospital });
    //find org
    const organizations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "Hospital organization record fetched successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all hospital organizations records",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonarController,
  getHospitalsController,
  getOrganizationsController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};

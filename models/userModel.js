const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Admin", "Organization", "Donar", "Hospital"],
    },
    name: {
      type: String,
      required: function () {
        if (this.role === "Donar" || this.role === "Admin") {
          return true;
        }
        return false;
      },
    },
    organizationName: {
      type: String,
      required: function () {
        if (this.role === "Organization") {
          return true;
        }
        return false;
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "Hospital") {
          return true;
        }
        return false;
      },
    },
    email: {
      type: String,
      required: [true, "Email os required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CreateUserValidator = require("../validators/UserValidator");
const UserModel = require("../models/UserModel");
const AuthMiddleware = require("../middlewares/auth");
const router = express.Router();
const env = require("../env");

//signup a new user
router.post("/", JoiValidator(CreateUserValidator), async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.user_id = `BR${Math.floor(1000 + Math.random() * 9000)}`;
    req.body.time_stamp = new Date().toLocaleString();

    const user = await UserModel.create(req.body);

    const result = user.toJSON();

    delete result.password;

    const token = jwt.sign({ id: user.id }, env.jwt_secret, {
      expiresIn: "12h"
    });

    res.status(200).json({
      status: "success",
      data: { user: result, token }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: 500,
      message: "An error occured while creating your user account"
    });
  }
});

//login a user
router.post("/login", async function(req, res) {
  try {
    const user = await UserModel.findOne(
      { email: req.body.email}||{ user_id: req.body.user_id},
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid login details"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid login details"
      });
    }

    const token = jwt.sign({ id: user.id }, env.jwt_secret, {
      expiresIn: "12h"
    });

    res.json({
      status: "success",
      data: { token }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error occured during login"
    });
  }
});

// Get s user's profile
router.get("/profile", AuthMiddleware, async function(req, res) {
  try {
    const user = await UserModel.findById(req.user);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User's details not available" });
    }

    res.json({
      status: "success",
      data: user
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "error",
      message: `${err.message}, Kindly login again`
    });
  }
});

// Get all users
router.get("", async function(req, res) {
  try {
    const users = await UserModel.find();

    if (users.length === 0) {
      return res.status(403).json({
        status: "success",
        message: "User details not available"
      });
    }

    res.json({
      status: "succcess",
      data: users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occured while getting users"
    });
  }
});

// Delete a user
router.delete("/:user_id", async function(req, res) {
  try {
    const deletedUser = await UserModel.findOneAndDelete({
      user_id: req.params.user_id
    });

    if (!deletedUser) {
      res.status(404).json({
        status: "error",
        message: "The User's record does not exist"
      });
      return;
    }

    res.json({
      status: "success",
      message: "User deleted successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Error deleting the user"
    });
  }
});

// Update and edit a user
router.put("/:user_id", async function(req, res) {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { user_id: req.params.user_id },
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        company_name: req.body.company_name,
        designation: req.body.designation,
        phone_number: req.body.phone_number,
        department: req.body.department,
        managers_name: req.body.managers_name,
        marital_status: req.body.marital_status,
        dob: req.body.dob,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        gender: req.body.gender
      },
      { new: true }
    );

    // Check if user not found and updated
    if (!updatedUser) {
      res.status(404).json({
        status: "error",
        message: "Sorry that user record does not exist"
      });
    }

    res.json({
      status: "success",
      data: updatedUser
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Error occured while updating the user"
    });
  }
});

module.exports = router;

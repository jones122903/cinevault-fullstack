const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/response");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendResponse(res, {
        statusCode: 400,
        status: "error",
        message: "User already exists",
      });
    }

    const user = await User.create({ name, email, password });

    sendResponse(res, {
      statusCode: 201,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      },
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register Error:", err);
    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await User.comparePassword(password, user.password))) {
      return sendResponse(res, {
        statusCode: 401,
        status: "error",
        message: "Invalid credentials",
      });
    }

    sendResponse(res, {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login Error:", err);
    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: err.message,
    });
  }
};

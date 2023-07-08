const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../config/validateMongDbId");

// create a user
const registerUser = asyncHandler(async (req, res) => {
  //check if user exists
  const email = req.body.email;
  //find user with this email from req.body
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //create a user
    const createUser = await User.create(req.body);
    res.status(200).json({
      status: true,
      message: "User created successfully!",
      createUser,
    });
  } else {
    throw new Error("User Already Exists!");
  }
});

//login a user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.status(200).json({
      status: true,
      message: "Logged In Successfully!",
      token: generateToken(findUser?._id),
      role: findUser?.roles,
      username: findUser?.firstname + " " + findUser?.lastname,
      user_image: findUser?.user_image,
    });
  } else {
    throw new Error("Invalid Credentials!");
  }
});

//Get All Users

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await User.find();
    res.status(200).json({
      status: true,
      message: "All Users Fetched Successfully",
      allUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//update a user

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    res.status(200).json({
      status: true,
      message: "profile updated successfully!",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { registerUser, loginUser, getAllUser, updateUser };

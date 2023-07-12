const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../config/validateMongDbId");
const crypto = require("crypto");

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

/* Get a user */
const getAuser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getProfile = await User.findById(id);
    res.status(200).json({ status: true, message: "User found", getProfile });
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

/* delete a user */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "user deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

/* Block a User */
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isblocked: true },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

/* Block a User */
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isblocked: false },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    if (user && (await user.isPasswordMatched(password))) {
      throw new Error("Please provide a new password instead of old one!");
    } else {
      user.password = password;
      await user.save();
      res
        .status(200)
        .json({ status: true, message: "Password updated successfully" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

/* forgot password token */
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("No User with this email!");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetlink = `http://localhost:5000/api/user/reset-password/${token}`;
    res.status(200).json(resetlink);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, please try again!");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res
    .status(200)
    .json({ status: true, mesage: "password reset successfully!" });
});

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  getAuser,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};

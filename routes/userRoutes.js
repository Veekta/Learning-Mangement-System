const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  updateUser,
} = require("../controllers/userCtrl");
const { isAdmin } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

/* all post routes */
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

/* all get routes */
userRouter.get("/all-users", isAdmin, getAllUser);

/*all put routes*/
userRouter.put("/update-profile", updateUser);

module.exports = userRouter;

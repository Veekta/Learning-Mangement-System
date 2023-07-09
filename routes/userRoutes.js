const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  updateUser,
  deleteUser,
  getAuser,
  blockUser,
  unBlockUser,
} = require("../controllers/userCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

/* all post routes */
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

/* all get routes */
userRouter.get("/all-users", isAdmin, getAllUser);
userRouter.get("/:id", authMiddleware, getAuser);

/*all put routes*/
userRouter.put("/update-profile", authMiddleware, updateUser);
userRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
userRouter.put("/unblock/:id", authMiddleware, isAdmin, unBlockUser);

/* all delete routes */
userRouter.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = userRouter;

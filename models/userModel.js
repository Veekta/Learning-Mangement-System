const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    user_image: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/442/477/png-clipart-computer-icons-user-profile-avatar-profile-heroes-profile.png",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      default: "user",
    },
    profession: {
      type: String,
      required: true,
    },
    isblocked: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    stripe_account_id: String,
    stripe_seller: {},
    stripeSession: {},
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

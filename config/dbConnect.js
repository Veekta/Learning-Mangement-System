const mongoose = require("mongoose");

const dbConnect = (url) => {
  return mongoose.connect(url).then(() => {
    console.log("database connected");
  });
};

module.exports = dbConnect;

const dbConnect = require("./config/dbConnect");
require("dotenv").config();
const express = require("express");
const { notFound, handleError } = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from lms job portal server");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", userRouter);

app.use(notFound);
app.use(handleError);

const startServer = async () => {
  try {
    await dbConnect(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

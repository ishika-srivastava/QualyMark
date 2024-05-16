require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

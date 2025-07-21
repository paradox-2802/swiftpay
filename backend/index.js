require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://swiftpay-frontend-r3d1.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

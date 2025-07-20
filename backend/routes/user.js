const express = require("express");

const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const authMiddleware = require("../middleware");

const router = express.Router();

const signupBody = zod.object({
  username: zod.email().min(3).max(30),
  password: zod.string().min(6),
  firstName: zod.string().max(50),
  lastName: zod.string().max(50),
});

router.post("/signup", async (req, res) => {
  const result = signupBody.safeParse(req.body);
  if (!result.success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const existingUser = await User.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  await Account.create({
    userId: user._id,
    balance: Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "User created successfully",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.email().min(3).max(30),
  password: zod.string().min(6),
});

router.post("/signin", async (req, res) => {
  const result = signinBody.safeParse(req.body);
  if (!result.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (existingUser) {
    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
    res.json({
      token: token,
    });
    return;
  }
  res.status(411).json({
    message: "Error while logging in",
  });
});

const updateBody = zod.object({
  password: zod.string().min(6),
  firstName: zod.string().max(50),
  lastName: zod.string().max(50),
});

router.put("/", authMiddleware, async (req, res) => {
  const result = updateBody.safeParse(req.body);
  if (!result.success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne(
    {
      _id: req.userId,
    },
    {
      $set: {
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    }
  );
  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    _id: { $ne: req.userId },
    $or: [
      { firstName: { $regex: filter, $options: "i" } },
      { lastName: { $regex: filter, $options: "i" } },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

router.get("/decode", authMiddleware, async (req, res) => {
  const userId = req.userId; 
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({
    firstName: user.firstName,
  });
});

module.exports = router;

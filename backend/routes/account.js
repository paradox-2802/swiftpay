const express = require("express");
const authMiddleware = require("../middleware");
const { Account } = require("../db");
const { json } = require("zod");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: account.balance,
  });
});

const mongoose = require("mongoose");

router.post("/transfer", authMiddleware, async (req, res) => {
  const { amount, to } = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid account" });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    res.json({ message: "Transfer successful" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Transaction failed", error: err.message });
  } finally {
    session.endSession(); 
  }
});


module.exports = router;

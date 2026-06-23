import crypto from "crypto";
import { Transaction } from "../models/index.js";

export const createTransaction = async ({ userId, userRole, amount, currency, description, metadata }) => {
  const clientSecret = crypto.randomBytes(16).toString("hex");
  const invoice = {
    id: `inv_${Date.now()}`,
    amount,
    currency,
    description,
    issuedAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const transaction = await Transaction.create({
    userId,
    userRole,
    amount,
    currency,
    status: "created",
    paymentMethod: process.env.PAYMENT_METHOD || "mock",
    clientSecret,
    description,
    metadata,
    invoice,
  });

  return transaction;
};

export const confirmTransaction = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  transaction.status = "confirmed";
  await transaction.save();

  return transaction;
};

export const failTransaction = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  transaction.status = "failed";
  await transaction.save();

  return transaction;
};

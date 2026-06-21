import { createTransaction, confirmTransaction, failTransaction } from "../services/paymentService.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "PKR", description, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid amount is required",
      });
    }

    const transaction = await createTransaction({
      userId: req.user.id,
      userRole: req.user.role,
      amount: Number(amount),
      currency,
      description,
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: "Payment intent created",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    const transaction = await confirmTransaction(transactionId);

    return res.status(200).json({
      success: true,
      message: "Payment confirmed",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};

export const failPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    const transaction = await failTransaction(transactionId);

    return res.status(200).json({
      success: true,
      message: "Payment failed",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

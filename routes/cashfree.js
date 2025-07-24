// routes/cashfree.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_API_KEY;
const CASHFREE_API_BASE = "https://sandbox.cashfree.com/pg";

router.post("/create-order", async (req, res) => {
  try {
    const { orderAmount, customerId, customerPhone, customerEmail, returnUrl } =
      req.body;

    const orderPayload = {
      order_id: `order_${Date.now()}`,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl || "https://yourfrontend.com/payment-success",
      },
    };

    const response = await axios.post(
      `${CASHFREE_API_BASE}/orders`,
      orderPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_CLIENT_ID,
          "x-client-secret": CASHFREE_CLIENT_SECRET,
          "x-api-version": "2022-09-01",
        },
      }
    );

    const { order_id, payment_session_id } = response.data;

    res.json({
      orderId: order_id,
      paymentSessionId: payment_session_id,
    });
  } catch (error) {
    console.error("Cashfree error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to create Cashfree order",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;

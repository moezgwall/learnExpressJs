// a simple payement module

const express = require("express");
const Stripe = require("stripe");
const stripe = Stripe(process.env.st_secret_key);

// use case :
// app.post("/api/v0/payement", makePayment);
// app.get("/api/v0/:paymentID",getPayStatus);

const makePayment = async (req, res) => {
  try {
    const { amount, currency, method } = req.body;
    // method or payment_method
    // too lazy to change it
    if (!amount || !currency || !method) {
      return res.status(400).json({ error: "Missing payement fields" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      method,
      confirm: true,
    });

    return res.status(200).json({
      message: "Payment successful",
      paymentID: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.log("payment error", error);
    return res.status(500).json({ error: error.message });
  }
};

const getPayStatus = async (req, res) => {
  try {
    const { paymentID } = req.params;
    if (!paymentID) {
      return res.status(400).json({ error: "missing payementID param" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentID);

    return res.status(200).json({
      currency: paymentIntent.currency,
      paymentID: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.log("payment error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { makePayment, getPayStatus };

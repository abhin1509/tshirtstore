const BigPromise = require("../middleware/bigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Razorpay = require("razorpay");

// Can send public key
exports.sendStripeKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    stripekey: process.env.STRIPE_API_KEY,
  });
});

exports.captureStripePayment = BigPromise(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    //automatic_payment_methods: { enabled: true },
  });

  // optional
  metadata: {
    integration_check: "accept_a_payment";
  }

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    client_secret: paymentIntent.client_secret,
    id: paymentIntent.id,
  });

  // The paymentIntent obj, is only created on success payments
  /*
  {
    "id": "pi_1DsTiO2eZvKYlo2CVnVhfyFr",
    "object": "payment_intent",
    "amount": 1099,
    "amount_capturable": 0,
    "amount_details": {
      "tip": {}
    },
    "amount_received": 0,
    "application": null,
    "application_fee_amount": null,
    "automatic_payment_methods": null,
    "canceled_at": null,
    "cancellation_reason": null,
    "capture_method": "automatic",
    "charges": {
      "object": "list",
      "data": [],
      "has_more": false,
      "url": "/v1/charges?payment_intent=pi_1DsTiO2eZvKYlo2CVnVhfyFr"
    },
    "client_secret": "pi_1DsTiO2eZvKYlo2CVnVhfyFr_secret_T1S2xKSQGmAd3GG0jODh3sHXq",
    "confirmation_method": "automatic",
    "created": 1547465688,
    "currency": "usd",
    "customer": null,
    "description": null,
    "invoice": null,
    "last_payment_error": null,
    "livemode": false,
    "metadata": {},
    "next_action": null,
    "on_behalf_of": null,
    "payment_method": null,
    "payment_method_options": {},
    "payment_method_types": [
      "card"
    ],
    "processing": null,
    "receipt_email": null,
    "redaction": null,
    "review": null,
    "setup_future_usage": null,
    "shipping": null,
    "statement_descriptor": null,
    "statement_descriptor_suffix": null,
    "status": "requires_payment_method",
    "transfer_data": null,
    "transfer_group": null
  }
  */
});

exports.sendRazorpayKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    stripekey: process.env.RAZORPAY_API_KEY,
  });
});

exports.captureRazorpayPayment = BigPromise(async (req, res, next) => {
  let instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  let options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: "receipt#5",
  };

  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  });
});

const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");

// Book a seat
router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.body.userId,
    });
    await newBooking.save();

    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();

    res.status(200).send({
      message: "Booking Successful",
      data: newBooking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking Failed",
      data: error,
      success: false,
    });
  }
});

// Make payment
router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotencyKey = uuidv4();
    const payment = await stripe.charges.create(
      {
        amount: amount * 100, // Convert to smallest currency unit
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      { idempotencyKey }
    );

    if (payment) {
      res.status(200).send({
        message: "Payment Successful",
        data: {
          transactionId: payment.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: "Payment Failed",
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Payment Failed",
      data: error,
      success: false,
    });
  }
});

// Get bookings by user ID
router.post("/get-booking-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("bus")
      .populate("user");

    res.status(200).send({
      message: "Booking Fetched Successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Fetching Bookings Failed",
      data: error,
      success: false,
    });
  }
});

// Get all bookings
router.post("/get-all-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");

    res.status(200).send({
      message: "Bookings Fetched Successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Fetching Bookings Failed",
      data: error,
      success: false,
    });
  }
});

module.exports = router;

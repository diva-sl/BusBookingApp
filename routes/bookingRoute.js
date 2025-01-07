const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
// const Stripe = require("stripe");

const stripe = require("stripe")(
  "sk_test_51QdPvNDXhLCwOGLxPd4y8VkokPpzioBGjZrhHnBmvS7Hqdh5rh4z3Orzs9UNb6JFNIWLd6HBvlUOkGnp7UpSRWcl00YljDVVc6"
);
// const stripe = Stripe(
//   "sk_test_51QdPvNDXhLCwOGLxPd4y8VkokPpzioBGjZrhHnBmvS7Hqdh5rh4z3Orzs9UNb6JFNIWLd6HBvlUOkGnp7UpSRWcl00YljDVVc6"
// );

const { v4: uuidv4 } = require("uuid");

//book a seat
router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      // transactionId: "1234", without stripe
      user: req.body.userId,
    });
    await newBooking.save();
    console.log(req.body, newBooking);
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

// make payment

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: amount,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      res.status(200).send({
        message: "Payment Successful",
        data: {
          transactionId: payment.source.id,
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

// get booking by user id

router.post("/get-booking-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      message: "Booking Fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking Fetched Failed",
      data: error,
      success: false,
    });
  }
});

// get all booking

router.post("/get-all-booking", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "Booking Fetched Successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking Fetched Failed",
      data: error,
      sucess: false,
    });
  }
});

module.exports = router;

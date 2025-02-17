const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
// const Stripe = require("stripe");

const stripe = require("stripe")(process.env.stripe_key);

const { v4: uuidv4 } = require("uuid");

// book-seat

router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body.bus);
    if (!bus) {
      return res.status(404).send({
        message: "Bus not found",
        success: false,
      });
    }

    const amount = req.body.seats.length * bus.fare;

    const newBooking = new Booking({
      ...req.body,
      amount,
      user: req.body.userId,
    });

    await newBooking.save();

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

router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
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

// get all bookings

router.post("/get-all-bookings", authMiddleware, async (req, res) => {
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

// cancel-ticket

router.post("/cancel-ticket", authMiddleware, async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res
      .status(400)
      .json({ success: false, message: "Ticket ID required" });
  }

  try {
    const booking = await Booking.findById(ticketId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    booking.status = "canceled";
    await booking.save();

    const bus = await Bus.findById(booking.bus);
    if (bus) {
      bus.seatsBooked = bus.seatsBooked.filter(
        (seat) => !booking.seats.includes(seat)
      );
      await bus.save();
    }

    res.json({ success: true, message: "Ticket canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

const router = require("express").Router();
const Bus = require("./models/busModel");
const authMiddleware = require("../middlewares/authMiddleare");

//add bus

router.post("/add-bus", authMiddleware, async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ number: req.body.number });
    if (existingBus) {
      return res.status(200).send({
        message: "Bus Already Exist",
        success: false,
      });
    }
    const newBus = new Bus(req.body);
    await newBus.save();
    return res.status(200).send({
      message: "Bus Added Successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// update bus

router.post("/update-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndUpadate(req.body._id, req.body);
    return res.status(200).send({
      message: "Bus Updated Successfully.",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// delete bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      message: "Bus Deleted Successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// get all buses

router.post("/get-all-buses", authMiddleware, async (req, res) => {
  try {
    const buses = await Bus.find();
    return res.status(200).send({
      message: "Buses Fetched Successfully",
      data: buses,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

//get bus by id

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    return res.status(200).send({
      message: "Bus Fetched Succesfully",
      data: bus,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;

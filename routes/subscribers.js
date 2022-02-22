const express = require("express");
const { update } = require("../models/subscriber");
const router = express.Router();
const Subscriber = require("../models/subscriber");

//Getting all
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});
//Getting one
router.get("/:id", getSubscriber, (req, res) => {
  res.send(res.subscriber);
});
//Creating one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });
  try {
    const newSubscriber = await subscriber.save();
    //send it to user using json, 201 means successfully created object therefore more specific
    res.status(201).json(newSubscriber);
  } catch (error) {
    //something wrong with user input
    res.status(400).json({ message: error.message });
  }
});
//updating one
//use patch instead of put because we only want to update what user passes us.
//example if they only send name, we update only name, and no other information
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }

  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }
  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//deleting one

router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "Deleted Subscriber" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    //try to get user based on id that user passes to us in url
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      //return because if there is no subscriber we want to leave and not go further
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.subscriber = subscriber;
  //necessary to move on to next piece of middleware or request itself
  next();
}

module.exports = router;

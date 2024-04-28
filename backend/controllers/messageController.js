const Messages = require("../models/messageModel");
const fs = require("fs");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.addImageMessage = async (req, res, next) => {
  try {
    const { from, to, imageUrl } = req.body;
    const data = await Messages.create({
      message: { imageUrl: imageUrl }, // Assuming imageUrl is the field name for storing image URL
      users: [from, to],
      sender: from,
    });

    if (data)
      return res.status(201).json({ msg: "Image message added successfully." });
    else
      return res
        .status(400)
        .json({ msg: "Failed to add image message to the database" });
  } catch (ex) {
    return res
      .status(400)
      .json({ msg: "Error occurred while adding image message." });
  }
};

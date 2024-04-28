const {
  addMessage,
  getMessages,
  addImageMessage,
} = require("../controllers/messageController");
const router = require("express").Router();
const multer = require("multer");
const uploadImage = multer({ dest: "uploads/images" });

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);

module.exports = router;

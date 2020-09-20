var express = require('express');
var scheduler = require('../helpers/scheduler');
var Notification = require('../models/notification');
var router = express.Router();


// Cambiar a post esta ruta
router.post('/', function (req, res) {
  const payload = {
    user: req.body.user,
    time: req.body.time,
    title: req.body.title,
    body: req.body.body,
  };

  // Create the notification
  try {
    // var notification = new Notification({
    //   user: "amzn1.ask.account.AEE5OZTLTUZS5LIXPC2SQE6HBX72TD2IYHTBHRHWU53Y6AJWSMEUW3T2BCLCBSTQ7RECLXQ5JLCBPK66MS74AQUSWM3NQX5QHVSTZEDXK7AJTRYQ7IXU4KBTKF3CXDOKLIURHIASDD7FNSMSKOZ4B5IFH3B7R54O2XD7NNPJXM7SRKOX43D7A7HYFYSULYQLU3LPVCGMBNLMGPY",
    //   title: "test", body: "test", time: new Date(Date.now() + 2000).toISOString()
    // })

    var notification = new Notification(payload)
  } catch (error) {
    res.status(400).json({ type: "Bad Request", message: error.message });
  }

  // Make the schedule
  scheduler.makeSchedule(notification.time, notification)

  res.status(202).json({success: true});
});

module.exports = router;
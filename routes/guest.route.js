const express = require("express");
const router = express.Router();

const { baseUrl } = require("../controllers/guest.controller");

router.get("", baseUrl);

module.exports = router;

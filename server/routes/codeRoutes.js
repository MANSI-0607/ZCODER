const express = require("express");
const router = express.Router();
const { runCode } = require("../controllers/codeController");
const protect = require('../middlewares/authMiddleware');

router.post("/run",runCode);

module.exports = router;

const express = require("express");

const { login, me, register } = require("../../controllers/auth");
const authenticate = require("../../middleware/authenticate");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

module.exports = router;

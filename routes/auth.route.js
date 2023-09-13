const express = require("express");
const router = express.Router();

const {
    register, login, logout,
    makeAdmin
} = require("./../controllers/auth.controller");

const {
    registerValidation, loginValidation, makeAdminValidation
} = require("./../validations/auth.validation");

const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", isAuthenticated, logout);

router.post("/make-admin", isAuthenticated, isAdmin, makeAdminValidation, makeAdmin);

module.exports = router;
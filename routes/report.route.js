const express = require("express");
const router = express.Router();

const {
    getReports, getReport, addReport, updateReport, deleteReport,
} = require("../controllers/report.controller");

const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.get("", isAuthenticated, getReports);
router.post("/add", isAuthenticated, isAdmin, addReport);
router.put("/update/:_id", isAuthenticated, isAdmin, updateReport);
router.delete("/delete/:_id", isAuthenticated, isAdmin, deleteReport);

module.exports = router;
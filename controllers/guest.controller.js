const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const apiResponse = require("../utils/apiResponse");

const baseUrl = catchAsync(async (req, res) => {
    res.json("Server is running")
    // return apiResponse(res, httpStatus.OK, { message: "welcome to home page." });
});

module.exports = {
    baseUrl,
}

const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const apiResponse = require("../utils/apiResponse");

const { ReportModel, ReportStatus } = require("../models/report.model");

const getReports = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reports = await ReportModel
    .find({ status: { $ne: ReportStatus.deleted } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalReports = await ReportModel.countDocuments({ status: { $ne: ReportStatus.deleted } });

  const totalPages = Math.ceil(totalReports / limit);

  const response = {
    data: { reports, page, totalPages, totalReports },
    message: "Successfully retrieved reports for page " + page,
  };

  return apiResponse(res, httpStatus.OK, response);
});

const getReport = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const data = await ReportModel.findOne({ _id, status: { $ne: ReportStatus.deleted } });

  if (!data) {
    return apiResponse(res, httpStatus.NOT_FOUND, { message: "No report found." });
  }

  return apiResponse(res, httpStatus.OK, { data, message: "Report successfully retrieved." });
});

const addReport = catchAsync(async (req, res) => {
  const { name, address, phone, email, profession, favoriteColors } = req.body;

  const newReport = new ReportModel({ name, address, phone, email, profession, favoriteColors });
  const data = await newReport.save();

  return apiResponse(res, httpStatus.OK, { data, message: "Report successfully added." });
});

const updateReport = catchAsync(async (req, res) => {
  const { name, address, phone, email, profession, favoriteColors } = req.body;

  const data = await ReportModel.updateOne(
    { _id: req.params._id, status: { $ne: ReportStatus.deleted } },
    { name, address, phone, email, profession, favoriteColors }
  );

  if (!data) {
    return apiResponse(res, httpStatus.NOT_FOUND, { message: "Report not found, update failed." });
  }

  return apiResponse(res, httpStatus.OK, { data, message: "Report successfully updated." });
});

const deleteReport = catchAsync(async (req, res) => {
  const data = await ReportModel.updateOne({ _id: req.params._id, status: { $ne: ReportStatus.deleted } }, { status: ReportStatus.deleted });

  if (!data) return apiResponse(res, httpStatus.NOT_FOUND, { message: "Report not found, deletion failed." });

  return apiResponse(res, httpStatus.OK, { message: "Report successfully deleted." });
});

module.exports = {
  getReports, getReport, addReport, updateReport, deleteReport,
};
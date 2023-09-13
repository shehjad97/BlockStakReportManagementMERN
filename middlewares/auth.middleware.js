const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const apiResponse = require("../utils/apiResponse");
const { UserModel, UserStatus } = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/auth");

const isAuthenticated = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
            return apiResponse(res, httpStatus.UNAUTHORIZED, { message: "Access token is missing. You might be logged out." });
        }

        const decodedAccessToken = await jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        req.user = decodedAccessToken;

        const user = await UserModel.findOne({
            _id: decodedAccessToken.userId,
            status: UserStatus.active
        });

        if (!user) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Invalid token" });

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedAccessToken.exp <= currentTime) {

            if (!refreshToken) {
                return apiResponse(res, httpStatus.UNAUTHORIZED, { message: "Access token is expired, and refresh token is missing" });
            }

            const decodedRefreshToken = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            if (!decodedRefreshToken) {
                return apiResponse(res, httpStatus.UNAUTHORIZED, { message: "Invalid refresh token" });
            }

            const user = await UserModel.findOne({
                _id: decodedRefreshToken.userId,
                status: UserStatus.active
            });

            if (!user) {
                return apiResponse(res, httpStatus.UNAUTHORIZED, { message: "User not found" });
            }

            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);

            res.setHeader('Set-Cookie', [
                cookie.serialize('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600,
                    sameSite: 'strict',
                    path: '/',
                }),
                cookie.serialize('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 86400 * 7,
                    sameSite: 'strict',
                    path: '/',
                })
            ]);
        }
        next();
    } catch (error) {
        return res.status(401).send(error);
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({
            _id: req.user.userId,
            status: UserStatus.active
        });

        if (!user) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Invalid user" });

        if (user.type === "admin") {
            next();
        } else {
            return apiResponse(res, httpStatus.FORBIDDEN, { message: "Permission denied. Admin access required" });
        }
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { isAuthenticated, isAdmin }
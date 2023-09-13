const httpStatus = require("http-status");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const cookie = require('cookie');

const catchAsync = require("../utils/catchAsync");
const apiResponse = require("../utils/apiResponse");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/auth');

const { UserModel, UserStatus } = require("../models/user.model")

const register = catchAsync(async (req, res) => {
    const { name, address, phone, email, password, confirmPassword, profession, favoriteColors } = req.body;
    const emailLower = email.toLowerCase();

    const isAdmin = await UserModel.countDocuments() === 0;

    var existingUser = await UserModel.findOne({ email: emailLower });
    if (existingUser) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Account with this email already exists" });

    if (password != confirmPassword) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Password does not match" });

    const newUser = new UserModel({
        name,
        address,
        phone,
        email: emailLower,
        password, // Password is hashed automatically on save from user model
        profession,
        favoriteColors,
        type: isAdmin ? "admin" : "regular",
    });

    const user = await newUser.save();

    return apiResponse(res, httpStatus.CREATED, {
        data: {
            _id: user._id,
            name: user.name,
            address: user.address,
            phone: user.phone,
            email: user.email,
            profession: user.profession,
            favoriteColors: user.favoriteColors,
        },
        message: "Account created successfully."
    })
})

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, status: UserStatus.active });

    if (!user) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Account does not exist" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Password does not match." });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.setHeader('Set-Cookie', [
        cookie.serialize('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
            sameSite: 'strict',
            path: '/',
        }),
        cookie.serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 86400 * 7,
            sameSite: 'strict',
            path: '/',
        })
    ]);

    return apiResponse(res, httpStatus.CREATED, { data: user, message: "Login successful" })
})

const makeAdmin = catchAsync(async (req, res) => {
    const { userId } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) { return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" }) }
    if (user.type == "admin") { return res.status(httpStatus.NOT_FOUND).json({ message: "User is already admin" }) }

    user.type = "admin";

    await user.save();

    return apiResponse(res, httpStatus.CREATED, { message: "User has been made an admin" })
})

const logout = (req, res) => {
    res.setHeader('Set-Cookie', [
        cookie.serialize('accessToken', '', {
            httpOnly: true,
            secure: true,
            maxAge: 0,
            sameSite: 'strict',
            path: '/',
        }),
        cookie.serialize('refreshToken', '', {
            httpOnly: true,
            secure: true,
            maxAge: 0,
            sameSite: 'strict',
            path: '/',
        })
    ]);
    
    return apiResponse(res, httpStatus.OK, { message: "Logged out successfully" });
};

module.exports = {
    register, login, logout,
    makeAdmin
}
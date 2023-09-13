const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const status = Object.freeze({
    active: 'active',
    deleted: 'deleted',
});

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/]
    },
    profession: {
        type: String,
        required: true,
    },
    favoriteColors: [{
        type: String,
        required: true,
    }],
    status: {
        type: String,
        enum: Object.values(status),
        default: status.active,
    },
}, { timestamps: true });

const model = mongoose.model("report", schema);
module.exports = { ReportModel: model, ReportStatus: status };

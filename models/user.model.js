const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const bcrypt = require("bcrypt");

const status = Object.freeze({
    active: 'active',
    deleted: 'deleted',
});

const type = Object.freeze({ 
    regular: 'regular', 
    admin: 'admin' 
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
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    favoriteColors: [{
        type: String,
        required: true,
    }],
    type: {
        type: String,
        enum: Object.values(type),
        default: type.regular,
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.active,
    },
}, { timestamps: true });

schema.statics.isUnique = async function (email) {
    const user = await this.findOne({ email });

    if (!user) {
        return true;
    } else if (user.email === email) {
        return { email };
    }

    return true;
};

schema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) user.password = await bcrypt.hash(user.password, 8);

    next();
});

schema.methods.isPasswordMatch = async function (password) {
    const user = this;

    return bcrypt.compare(password, user.password);
};

schema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.password;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const model = mongoose.model("user", schema);
module.exports = { UserModel: model, UserStatus: status };

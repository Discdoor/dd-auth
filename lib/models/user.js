const { default: mongoose } = require("mongoose");

const User = new mongoose.Schema({
    id: String,
    name: String,
    discrim: String,
    email: String,
    phone: String,
    avatarUrl: String,
    status: String,
    passwordHash: String
});
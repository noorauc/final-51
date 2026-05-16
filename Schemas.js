const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const DestinationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    weather: { type: String, required: true },
    dining: { type: String, required: true },
    season: { type: String, required: true }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Destination: mongoose.model('Destination', DestinationSchema)
};
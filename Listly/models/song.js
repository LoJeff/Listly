
const mongoose = require('mongoose');
const Joi = require('joi');

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        trim: true,
        default: ""
    },
    artist: {
        type: String,
        trim: true,
        default: ""
    }
});

module.exports = {
    songModel: mongoose.model('Song', songSchema),

    isValid: function (song) {
        const schema = {
            name: Joi.string().required(),
            genre: Joi.string(),
            artist: Joi.string()
        };

        return Joi.validate(song, schema);
    }
}
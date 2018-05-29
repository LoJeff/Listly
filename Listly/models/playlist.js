
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validator: function (nameIn) {
            return (nameIn != 'Most Played') || (nameIn != 'Recently Added');
        },
        message: 'Cannot use default playlist names'
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }]
});

module.exports = {
    playlistModel: mongoose.model('Playlist', playlistSchema),

    isValid: function (playlist) {
        const schema = {
            name: Joi.string().required()
                .regex(/.*Recently Added.*/i, { name: 'nonDefault', invert: true })
                .regex(/.*Most Played.*/i, { name: 'nonDefault', invert: true })
        };

        return Joi.validate(playlist, schema);
    }
}
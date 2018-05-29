//--Helper Functions--

const Joi = require('joi');

var defPlaylistIDs = [
    '5b05d73451e27cabe8816dc9', // Recently Added
    '5b05d74051e27cabe8816dca'  // Most Played
]

module.exports = {
    checkPlaylistIDDefault: function (id) {
        defPlaylist = false;
        for (var i = 0; i < defPlaylistIDs.length; i++) {
            if (id === defPlaylistIDs[i]) {
                defPlaylist = true;
                break;
            }
        }
        return defPlaylist;
    },
    checkForValidSongId: async function (id) {
        try {
            return await Song.findById(id);
        } catch (err) {
            return false
        }
    }
}

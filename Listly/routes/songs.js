
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const Fawn = require('fawn');

Fawn.init(mongoose);

const song = require('../models/song');
const Song = song.songModel;
const playlist = require('../models/playlist');
const Playlist = playlist.playlistModel;

const helpFunc = require('./routeHelperFunc');

//--Database Functions--

//-Song Default-
async function getSongById(id) {
    try {
        return await Song.findById(id);
    } catch (err) {
        return dbDebugger(err);
    }
}

async function createSong(songBody) {
    const song = new Song({
        name: songBody.name,
        genre: songBody.genre,
        artist: songBody.artist
    })

    try {
        return await song.save();
    } catch (err) {
        return dbDebugger(err);
    }
}

async function updateSong(id, nameIn, genreIn, artistIn) {
    try {
        if (nameIn != null) {
            return await Song.update({ _id: id }, {
                $set: {
                    name: nameIn
                }
            })
        }
        if (genreIn != null) {
            return await Song.update({ _id: id }, {
                $set: {
                    genre: genreIn
                }
            })
        }
        if (artistIn != null) {
            return await Song.update({ _id: id }, {
                $set: {
                    artist: artistIn
                }
            })
        }
    } catch (err) {
        return dbDebugger(err);
    }
}

async function removeSongById(id) {
    try {
        new Fawn.Task()
            .update('playlists', { songs: { $in: id } }, {
                $pull: {
                    songs: id
                }
            }).options({multi: true})
            .remove('songs', { _id: id })
        //await Playlist.updateMany({ songs: { $in: id } }, {
        //    $pull: {
        //        songs: id
        //    }
        //});

        //return await Song.deleteOne({ _id: id })
    } catch (err) {
        return dbDebugger(err);
    }
}


//--Router Functions--

//-Song-
//  get song by id
router.get('/:id', function (req, res) {
    getSongById(req.params.id)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.status(404).send('Song not found');
        });
});

//  create song with given info
router.post('/', function (req, res) {
    const { error } = song.isValid(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    createSong(req.body)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.send(err);
        })
})

router.put('/:id', function (req, res) {
    if (req.body.name != null) {
        updateSong(req.params.id, req.body.name, req.body.genre, req.body.artist)
            .then(function (result) {
                return res.send(result);
            })
            .catch(function (err) {
                dbDebugger(err);
                return res.status(400).send(err);
            });
    }
});

// remove song by id
router.delete('/:id', function (req, res) {
    removeSongById(req.params.id)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.send(err);
        })
})

module.exports = router;
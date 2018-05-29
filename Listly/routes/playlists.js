
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');

const helpFunc = require('./routeHelperFunc');
const song = require('../models/song');
const Song = song.songModel;
const playlist = require('../models/playlist');
const Playlist = playlist.playlistModel;

//--Database Functions--

//-Playlist Default-
async function getPlaylists() {
    try {
        return await Playlist
            .find()
            .populate('songs', 'name');
    } catch (err) {
        return dbDebugger(err);
    }
}

async function getPlaylistById(id) {
    try {
        return await Playlist
            .findById(id)
            .populate('songs', 'name');
    } catch (err) {
        return dbDebugger(err);
    }
}

async function createEmptyPlaylist(nameIn) {
    const playlist = new Playlist({
        name: nameIn
    });

    try {
        return await playlist.save();
    } catch (err) {
        return dbDebugger(err);
    }
}

async function removePlaylistById(id) {
    try {
        return await Playlist.deleteOne({ _id: id })
    } catch (err) {
        return dbDebugger(err);
    }
}

async function renamePlaylist(id, nameIn) {
    try {
        return await Playlist.update({ _id: id }, {
            $set: {
                name: nameIn
            }
        });
    } catch (err) {
        return dbDebugger(err);
    }
    
}

//-Playlist Song Functions-
async function addSongPlaylist(id, songId) {
    try {
        const exist = await Song.findById(songId);
        if (!exist) {
            throw "Song not found";
        }
        const result = await Playlist.update({ _id: id }, {
            $addToSet: {
                songs: songId
            }
        });
        return result;
    } catch (err) {
        return dbDebugger(err);
    }
}

async function removeSongPlaylist(id, songId) {
    try {
        const result = await Playlist.update({ _id: id }, {
            $pull: {
                songs: songId
            }
        });
        return result;
    } catch (err) {
        return dbDebugger(err);
    }
}


//--Router Functions--

//-Playlist-
//  get all playlists
router.get('/', function (req, res) {
    getPlaylists()
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.status(404).send('No playlists found');
        });
});

//  get playlist from id
router.get('/:id', function (req, res) {
    getPlaylistById(req.params.id)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.status(404).send('Playlist not found');
        });
});

//  create empty playlist with given name
router.post('/', function (req, res) {
    const { error } = playlist.isValid(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    createEmptyPlaylist(req.body.name)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.send(err);
        })
});

//  rename playlists with given id and name
router.put('/name/:id', function (req, res) {
    if (helpFunc.checkPlaylistIDDefault(req.params.id)) {
        return res.status(403).send('Unable to rename default playlists');
    }

    const { error } = playlist.isValid(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    renamePlaylist(req.params.id, req.body.name)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.send(err);
        });
});

//  adding song to playlist with given ids
router.put('/song/:id', function (req, res) {
    if (req.body.songId == null) {
        return res.status(404).send('No songId input found');
    }

    if (!(mongoose.Types.ObjectId.isValid(req.body.songId))) {
        return res.status(422).send('Invalid songId input');
    }

    addSongPlaylist(req.params.id, req.body.songId)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.send(err);
        })
});

//  delete song from playlist with given id
router.delete('/song/:id', function (req, res) {
    if (req.body.songId == null) {
        return res.status(404).send('No songId input found');
    }

    if (!(mongoose.Types.ObjectId.isValid(req.body.songId))) {
        return res.status(422).send('Invalid songId input');
    }

    removeSongPlaylist(req.params.id, req.body.songId)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.send(err);
        })
})

//  delete playlist with given id
router.delete('/:id', function (req, res) {

    if (helpFunc.checkPlaylistIDDefault(req.params.id)) {
        return res.status(403).send('Unable to delete default playlists');
    }

    removePlaylistById(req.params.id, req.params.id)
        .then(function (result) {
            return res.send(result);
        })
        .catch(function (err) {
            dbDebugger(err);
            return res.send(err);
        })
});

module.exports = router;
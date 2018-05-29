'use strict';

const Joi = require('joi');
const express = require('express');
const app = express();
const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/listly')
    .then(function () { console.log('Connected to MongoDB...') })
    .catch(function (err) { console.log('Could not connect to MongoDB...', err) });

const home = require('./routes/home');
const songs = require('./routes/songs');
const playlists = require('./routes/playlists');
 
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use('/', home);
app.use('/api/playlists', playlists);
app.use('/api/songs', songs);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
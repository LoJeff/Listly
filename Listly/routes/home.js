const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Listly', message: 'Welcome' });
});

module.exports = router;
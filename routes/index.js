const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
        res.send("hello from get")
    })
    .post('/', (req, res) => {
        res.send("hello from post")
    })
    .put('/', (req, res) => {
        res.send("hello from put")
    })
    .delete('/', (req, res) => {
        res.send("hello from delete")
    })
    .patch('/', (req, res) => {
        res.send("hello from delete")
    });

module.exports = router;
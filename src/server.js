const express = require ('express');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'Hello, welcome to feedback station!'
    })
})

module.exports = { app };
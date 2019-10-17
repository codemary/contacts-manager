const express = require('express')
const app = express()

let path = require('path');
const port = 4000

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'another_index.html'))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
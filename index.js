const express = require('express');
const app = express();
const PORT = 80;

app.get('/cool', (req, res) => {
    res.send('Welcome to my website! it is currently very sigma');
});

app.listen(PORT, () => {
    console.log(`Server is running on thing thing i guess`);
});

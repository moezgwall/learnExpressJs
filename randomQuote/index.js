const express = require('express');
const path = require('path');
const controller = require('./index/controller.js');
const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self' http://127.0.0.1:3000 http://localhost:3000;"
    );
    next();
});

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, "main", "viewer.html"));
});

app.use(express.static(path.join(__dirname, "main")));
app.get('/api/verse', controller.show);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(502).json({ error: "could not fetch that verse rn" });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const app = express();
const crypto = require("crypto");
const PORT = 3000;
const sessions = new Map();

const users = {
  alex: { password: "bjarne" },
  zozin: { password: "tsoding" },
};

app.use(express.json());

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

app.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "information invalid" });
  }
  if (users[username] && users[username].password === password) {
    const token = generateToken();
    sessions.set(token, { username, creationDate: Date.now() });

    return res.json({ success: true, token });
  }

  return res
    .status(401)
    .json({ success: false, message: "invalid inforamtion" });
});

app.get("/profile", (req, res) => {
  const token = req.headers["authorization"];
  if (!token || !sessions.get(token)) {
    return res.status(403).json({ message: "access denied" });
  }

  const session = sessions.get(token);
  return res.json({ message: "access granted!", user: session.username });
});

app.get("/", (req, res) => {
  console.log("GET / WORKING FINE");
  res.send("weclome to SERVER! ur mom");
});

app.listen(PORT, () => {
  console.log(`server is runing at current port: ${PORT}`);
});

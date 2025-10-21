const fs = require("fs");
// just example
const filepath = "./messages.json";

function HandleFile(path, data, encoding = "utf-8", callback) {
  if (data === undefined || data === null) {
    fs.readFile(path, encoding, callback);
  } else {
    fs.writeFile(path, data, encoding, callback);
  }
}

async function HandleFileAsync(path, data, encoding = "utf-8") {
  if (data === undefined || data === null) {
    return await fs.promises.readFile(path, encoding);
  }
  return await fs.promises.writeFile(path, data, encoding);
}

module.exports = { HandleFile, HandleFileAsync };

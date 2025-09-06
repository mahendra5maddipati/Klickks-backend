const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "users.db");

const db = new sqlite3.Database(dbPath, (e) => {
    if (e) return console.error("DB open error", e);
    console.log("DB connected", dbPath);
})

const init = () => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )`
    );
};

init();

module.exports = db;
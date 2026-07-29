const { DatabaseSync } = require("node:sqlite");

const database = new DatabaseSync("studysync.db");

database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subject TEXT NOT NULL DEFAULT 'General',
        completed INTEGER NOT NULL DEFAULT 0
    )
`);

module.exports = database;
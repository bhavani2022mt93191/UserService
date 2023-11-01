const sqlite3 = require("sqlite3");

const getDBConnection = () => new sqlite3.Database("appointment.db");

const dbInit = () => {
  const db = getDBConnection();
  // Create a table
  db.run(
    "CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY, name TEXT, email TEXT, pwd TEXT, type INTEGER)"
  );
  db.close();
};

module.exports = { dbInit, getDBConnection };

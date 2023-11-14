const sqlite3 = require("sqlite3");

const getDBConnection = () => new sqlite3.Database("appointment.db");

const dbInit = () => {
  const db = getDBConnection();
  // Create a table
  db.run(
    "CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY, name TEXT, email TEXT,mobile TEXT, pwd TEXT, type INTEGER)"
  );
  // db.all(
  //   `SELECT * FROM User where name = ?`,
  //   ["admin1"],
  //   function (error, rows) {
  //     if (error) {
  //      console.log("unable to create admin")
  //     } else if(rows.length > 0){
  //       db.run(
  //         `INSERT INTO User (name, email,pwd, type) VALUES ("admin1","admin1@gmail.com","admin1","1")`,
  //         function (error) {
  //           if (error) {
  //             console.log("unable to create admin")
  //           } else {
  //             console.log("admin created sucessfully")
  //           }
  //         }
  //       );
  //     } else{
  //       console.log("admin already created")
  //     }
  //   }
  // );
  
  db.close();
};

module.exports = { dbInit, getDBConnection };

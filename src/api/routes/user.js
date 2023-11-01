const express = require("express");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getDBConnection } = require("../../AppDAO");
const {send400ErrorResponse, send500ErrorResponse} = require("./utils");

//returns all user based on userTypeId
//for admin, userType = 1
//for doctor, userType = 2
//for patients, userType = 3
router.get("/", async (req, res, next) => {
  const userType = req.query.type || 2;
  try {
    const db = getDBConnection();
    await db.all(
      "SELECT * FROM USER WHERE TYPE = ?",
      userType,
      (error, rows) => {
        if (error) {
          send500ErrorResponse(res);
        } else {
          const response = {
            count: rows.length,
            users: rows.map((row) => {
              return {
                name: row.name,
                id: row.id,
                email: row.email,
                request: {
                  type: "GET",
                  endpoint: "http://localhost:3000/user/" + row.id,
                },
              };
            }),
          };

          res.status(200).json(response);
        }
      }
    ).close;
  } catch (error) {
    console.log(error);
    send500ErrorResponse(res);
  }
  // fetch all patients from DB
  // make response & returns
});

router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  if (!userId) {
    send400ErrorResponse(res);
    return;
  }
  try {
    const db = getDBConnection();
    db.all("SELECT * FROM USER WHERE ID = ?", userId, function (error, rows) {
      console.log("select", error, rows);
      if (error) {
        console.log(error);
        send500ErrorResponse(res);
      } else {
        console.log(rows);
        const response = {
          count: rows.length,
          users: rows.map((row) => {
            return {
              name: row.name,
              id: row.id,
              email: row.email,
              request: {
                type: "GET",
                endpoint: "http://localhost:3000/user/" + row.id,
              },
            };
          }),
        };
        res.status(200).json(response);
      }
    }).close;
  } catch (error) {
    console.log(error);
    send500ErrorResponse(res);
  }
});

//add user
router.post("/", (req, res) => {
  try {
    const user = req.body;
    if (!user || !(user.name && user.email && user.type)) {
      send400ErrorResponse(res);
      return;
    }

    const db = getDBConnection();
    //TODO: check for presence of user by emailId
    bcrypt.hash(user.pwd, 10, (err, hash) => {
      if (err) {
        db.close();
        return send500ErrorResponse(res, err, "hash passwod");
      } else {
        db.run(
          `INSERT INTO User (name, email,pwd, type) VALUES (?,?,?,?)`,
          [user.name, user.email, hash, user.type],
          function (error) {
            if (error) {
              res.status(500).json({
                message: "invalid data",
              });
            } else {
              res.status(201).json({
                message: "Created user successfully",
                createdUser: {
                  name: req?.body?.name,
                  email: req?.body?.email,
                  _id: this.lastID,
                  request: {
                    type: "GET",
                    url: "http://localhost:3000/patient/" + this.lastID,
                  },
                },
              });
            }
          }
        ).close();
      }
    });
   
  } catch (error) {
    console.log("error", error);
    send500ErrorResponse(res);
  }
});

//update patient info
router.put("/", (req, res, next) => {
  try {
    const user = req.body;
    if (!user || !(user.id && user.name && user.email)) {
      send400ErrorResponse(res);
    }

    const db = getDBConnection();
    db.run(
      `UPDATE User SET name=?,email=? WHERE id = ?`,
      [user.name, user.email, user.id],
      function (error) {
        if (error) {
          res.status(500).json({
            message: "invalid data",
          });
        } else if (this.changes > 0) {
          res.status(200).json({
            message: "Updated user info successfully",
            updatedUser: {
              ...user,
              request: {
                type: "GET",
                url: "http://localhost:3000/patient/" + user.id,
              },
            },
          });
        } else {
          send400ErrorResponse(res);
        }
      }
    ).close;
  } catch (error) {
    console.log("error", error);
    send500ErrorResponse(res);
  }
});

router.delete("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    send400ErrorResponse(res);
    return;
  }
  try {
    const db = getDBConnection();
    db.run("DELETE FROM USER WHERE ID = ?", userId, function (error) {
      if (error) {
        console.log(error);
        send500ErrorResponse(res);
      } else {
        console.log(this.changes);
        if (this.changes > 0) {
          res.status(200).json({
            message: "User deleted",
            request: {
              type: "POST",
              url: "http://localhost:3000/user",
              body: { name: "String", email: "String" },
            },
          });
        } else {
          send400ErrorResponse(res);
        }
      }
    }).close;
  } catch (error) {
    console.log(error);
    send500ErrorResponse(res);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDBConnection } = require("../../AppDAO");
const { sendResponse } = require("./utils");

const jwtSecret = process.env.JWT_SECRET || "JWT_SECRET_ASLKJFE";

router.post("/", (req, res, next) => {
  const { email, pwd } = req.body;
  try {
    const db = getDBConnection();
    db.all("SELECT * FROM USER WHERE EMAIL = ?", email, function (error, rows) {
      console.log("select", error, rows);
      if (error) {
        console.log(error);
        return send500ErrorResponse(res);
      } else if (rows.length <= 0) {
        return res.status(401).json({
          message: "auth failed",
        });
      } else {
        bcrypt.compare(pwd, rows[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed",
            });
          }
          if (result) {
            console.log("test" + jwtSecret);
            const token = jwt.sign(
              {
                email: rows[0].email,
                userId: rows[0].id,
              },
              jwtSecret,
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
            });
          }
          return res.status(401).json({
            message: "Auth failed",
          });
        });
      }
    }).close();
  } catch (exp) {}

  //     console.log(rows);
  //     const response = {
  //       count: rows.length,
  //       users: rows.map((row) => {
  //         return {
  //           name: row.name,
  //           id: row.id,
  //           email: row.email,
  //           request: {
  //             type: "GET",
  //             endpoint: "http://localhost:3000/user/" + row.id,
  //           },
  //         };
  //       }),
  //     };
  //     res.status(200).json(response);
  //   }
  // }).close;
  //   }catch (error) {
  //   console.log(error);
  //   send500ErrorResponse(res);
  // }

  // if (!userId) {
  //   send400ErrorResponse(res);
  //   return;
  // }
  // User.find({ email: req.body.email })
  //   .exec()
  //   .then(user => {
  //     if (user.length < 1) {
  //       return send400ErrorResponse(res, "Auth failed");
  //     }
  //     bcrypt.compare(req.body.password, user[0].pwd, (err, result) => {
  //       if (err) {
  //         return res.status(401).json({
  //           message: "Auth failed"
  //         });
  //       }
  //       if (result) {
  //         console.log("test"+jwtSecret);
  //         const token = jwt.sign(
  //           {
  //             email: user[0].email,
  //             userId: user[0]._id
  //           },
  //           jwtSecret,
  //           {
  //               expiresIn: "1h"
  //           }
  //         );
  //         return res.status(200).json({
  //           message: "Auth successful",
  //           token: token
  //         });
  //       }
  //       res.status(401).json({
  //         message: "Auth failed"
  //       });
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err
  //     });
  //   });
});

app.get("/", (req, res, next) => {
  if (!req.headers.authorization) {
    return sendResponse(res, 401, "Not Authorized");
  }

  // Bearer <token>>
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token is valid
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return sendResponse(res, 401, "Not Authorized");
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDBConnection } = require("../../AppDAO");
const {send400ErrorResponse, send500ErrorResponse} = require("./utils");

const jwtSecret = process.env.JWT_SECRET || "JWT_SECRET_ASLKJFE"


router.post("/", (req, res, next) => {
  const {email, pwd} = req.body;
  try {
    const db = getDBConnection();
    db.all("SELECT * FROM USER WHERE EMAIL = ?",email, function (error, rows) {
      console.log("select", error, rows);
      if (error) {
        console.log(error);
        return send500ErrorResponse(res);
      } else if(rows.length <= 0){
        return res.status(401).json({
          message: "auth failed",
        })
      } else {
        bcrypt.compare(pwd, rows[0].pwd, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: `Auth failed 2 ${rows[0].pwd}`
            });
          }
          if (result) {
            console.log("test"+jwtSecret);
            const token = jwt.sign(
              {
                email: rows[0].email,
                userId: rows[0].id
              },
              jwtSecret,
              {
                  expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          return res.status(401).json({
            message: "Auth failed"
          });
        });
      }
    }).close();
  } catch (exp){

  }
});

module.exports = router;

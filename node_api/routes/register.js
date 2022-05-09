var express = require('express');
var bcrypt = require('bcryptjs');
const { signupValidation, loginValidation } = require('../validations/validation');
var register_route = express.Router();

/*  Register API. */

register_route.post('/register',signupValidation, (req, res, next) => {
  console.log("Register API");
  console.log(req.body.first_name);
  console.log(req.body.email);

  con.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${con.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This user is already registered'
        });
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            con.query(
              `INSERT INTO users (first_name,last_name,username, email, password) VALUES (
               '${req.body.first_name}', 
               '${req.body.last_name}', 
                ${con.escape(req.body.email)}, 
                ${con.escape(req.body.email)}, 
                ${con.escape(hash)})`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  msg: 'The user have registered succesfully'
                });
              }
            );
          }
        });
      }
    }
  );
});

module.exports = register_route;

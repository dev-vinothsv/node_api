var express = require('express');
var bcrypt = require('bcryptjs');
var login_route = express.Router();
const jwt = require('jsonwebtoken');
/* GET login. */

login_route.post('/login', function(req, res, next) {

  console.log(con.escape(req.body.email));
  con.query(
    'SELECT * FROM users WHERE email = "'+req.body.email+'";',
    (err, result) => {
      console.log(result);
      console.log(err);
      // user does not exists
      
      if (!result.length) {
        return res.status(401).send({
          msg: 'user not exists'
        });
      }
      // check password
      console.log("Check password");
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          console.log(bResult);
          if (!bResult) {
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }else{
            const token = jwt.sign({id:result[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
            con.query(
              `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
         
        }
      );
    }
  );
});

login_route.get('/logout', function(req, res){

});

module.exports = login_route;

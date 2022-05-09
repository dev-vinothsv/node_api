var express = require('express');
var user_router = express.Router();
var userService = require ("../services/users");
var moment = require('moment'); // require

moment().format(); 
/* GET users page. */
user_router.get('/list',ensureAuthenticated,function(req, res){
	usersSQL = 'SELECT * FROM users'
	connection.query(usersSQL, function(err, rows, fields) {
			
			for (i = 0; i < rows.length; i++) {
				rows[i].created_at = moment(rows[i].created_at).format('YYYY-MM-DD  h:mm:ss');
			} 
		
		
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
		 console.log(req.session.passport.user.id);
	            res.render('users/list',{page_title:"Users",users:rows,user:req.session.passport.user,message:req.flash('message')});
	         });
});


user_router.get('/create', ensureAuthenticated,function(req, res){
		console.log("User Create");
	  res.render('users/create',{page_title:"Add User",user:req.session.passport.user,message:req.flash('message')});
});

user_router.post('/save', ensureAuthenticated,function(req, res){ 
	 
	try {
	   userService.createNewUser(req,res);	 
	  
     } catch (e) { 
	 
	 }
});


user_router.get('/delete', ensureAuthenticated,function(req, res){
	
	var id = req.query.id;	
	
	let response = userService.deleteUser(id);
	req.flash('message','User deleted successfully');
	res.redirect('/users/list');	
	         
});


user_router.get('/edit', ensureAuthenticated,function(req, res){	
	var user_id = req.query.id;
	var user_data = getUserData(user_id).then(function(user_data){
		console.log(user_data);
		res.render('users/edit',{page_title:"Edit User",logged_user:req.session.passport.user,user:user_data[0]});
	});
	
});


user_router.post('/update/:id', ensureAuthenticated,function(req, res){		
	let response = userService.updateUser(req);
	req.flash('message','User updated successfully');
	res.redirect('/users/list');
});

function getUserData(user_id) {
	return new Promise((resolve, reject) => {
    try{
        connection.query("SELECT u.*,ur.role_id from users as u inner join role_user as ur on u.id=ur.user_id where u.id = ?", user_id, function(error, rows) {
            if(error) reject(error);
            if(rows.length > 0) resolve(rows);
            resolve(false);
        })
    }catch (e) {
        reject(e);
    }
});
};


function ensureAuthenticated(req, res, next) {
	
	if (req.isAuthenticated()) {    
		return next();
	} 
	res.redirect('/')
}

module.exports = user_router;

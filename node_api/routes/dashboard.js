var express = require('express');
var dashboard_route = express.Router();

/* GET dashboard page. */
dashboard_route.get('/dashboard', ensureAuthenticated,function(req, res){
	count_query = 'SELECT count(*) as user_count, (select count(*) as operator_count from  operators) as operator_count FROM users'
	connection.query(count_query, function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }	

	dashboard_details = {user_count:rows[0].user_count,operator_count:rows[0].operator_count};
	console.log("User Details");
	console.log(req.session.passport.user);
	res.render('dashboard',{page_title:"Dashboard",dashboard_details:dashboard_details,user:req.session.passport.user});
	});
});





function ensureAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.isAuthenticated()) {    
		return next();
	} 
	res.redirect('/')
}

module.exports = dashboard_route;

var express = require('express');
var location_router = express.Router();
var locationService = require ("../services/locations");
var moment = require('moment'); // require
moment().format(); 
/* GET location page. */
location_router.get('/list',ensureAuthenticated,function(req, res){
	locationSQL = 'SELECT f.* FROM locations as f'
	connection.query(locationSQL, function(err, rows, fields) {			
			for (i = 0; i < rows.length; i++) {
				rows[i].created_at = moment(rows[i].created_at).format('YYYY-MM-DD  h:mm:ss');
			} 	
			
		    if(err){
	           console.log("Error Selecting : %s ",err );
		    }
		    console.log("USER ID "+ req.session.passport.user.id);
		 
	        res.render('locations/list',{page_title:"locations",locations:rows,user:req.session.passport.user,message:req.flash('message')});
	    });
});


location_router.get('/create', ensureAuthenticated,function(req, res){
	console.log("location Create");
	var operators = getOperatorData().then(function(operators){	
		res.render('locations/create',{page_title:"Add location",operators: operators,user:req.session.passport.user, message:req.flash('message')});
	});
	  
});

location_router.post('/save', ensureAuthenticated,function(req, res){ 
	 
	try {
	   locationService.createlocation(req,res);	 
	  
     } catch (e) { 
	 
	 }
});


location_router.get('/delete', ensureAuthenticated,function(req, res){
	
	var id = req.query.id;
	let response = locationService.deletelocation(id);
	req.flash('message','location deleted successfully');
	res.redirect('/locations/list');	
	         
});


location_router.get('/edit', ensureAuthenticated,function(req, res){	
	var location_id = req.query.id;
	
		var location_data = getlocationData(location_id).then(function(location_data){
		
			var operator_data = getOperatorData().then(function(operators){ 
			console.log(operators);
			res.render('locations/edit',{page_title:"Edit location",user:req.session.passport.user,operators: operators,location:location_data[0]});
		});
	});
	
});


location_router.post('/update/:id', ensureAuthenticated,function(req, res){		
	let response = locationService.updatelocation(req);
	req.flash('message','location updated successfully');
	res.redirect('/locations/list')
});

function getlocationData(location_id) {
	return new Promise((resolve, reject) => {
    try{
        connection.query("SELECT  f.* FROM locations as f where f.id = ?", location_id, function(error, rows) {
            if(error) reject(error);
            if(rows.length > 0) resolve(rows);
            resolve(false);
        })
    }catch (e) {
        reject(e);
    }
});
};

function getOperatorData() {
	return new Promise((resolve, reject) => {
    try{
        connection.query("SELECT * from operators where status = 1", function(error, rows) {
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

module.exports = location_router;

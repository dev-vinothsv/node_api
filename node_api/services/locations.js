 require('../config/connectDB');
var bcrypt = require('bcryptjs');
var moment = require('moment'); // require
moment().format(); 

function createLocation(req,res){
	    var msg =   SaveLocation(req).then(function(response) {
      //here when you resolve
		console.log(response);
		req.flash('message',response);
	
      })
    .catch(function(rej) {
      //here when you reject the promise
    console.log(rej);
	req.flash('message',rej);	

    });
	
	
}

function deleteLocation(id){
	location_delete_query = "DELETE FROM locations  WHERE id = ?";
	connection.query(location_delete_query,[id],function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }else{			 
			 return '1';
		 }
	
   });
	
}

function updateLocation(req){
	 return  updateLocationData(req).then(function() {
      //here when you resolve
      })
    .catch(function(rej) {
      //here when you reject the promise
      console.log(rej);
    });
	
}


let updateLocationData = (req) => {
	return new Promise(async (resolve, reject) => {
		
        try {
				console.log(req.body);
				var data = new Array();
			   let location_id = req.params.id;           
                
				let location_name = req.body.location_name;
				let location_code = req.body.location_code;
				let address = req.body.address;
				let city = req.body.city;
				let state = req.body.state;
				let zip = req.body.zip;
				let status = req.body.status;
				let test_site = req.body.test_site;
				let operator_id = req.body.operator_id;
				
				data['name'] = location_name;
				data['location_code'] = location_code;
				data['address'] = address;
				data['city'] = city;
				data['state'] = state;
				data['zip'] = zip;
				data['status'] = status;	
				data['operator_id'] = operator_id;					
				data['test_site'] = test_site;
				data['updated_at'] =   moment().format('YYYY-MM-DD  h:mm:ss');
				
				
console.log(data);		
				var location_data = Object.assign({}, data);
console.log(location_data);
                //update location
                connection.query("UPDATE locations set ? WHERE id = ?", [location_data,location_id], function(location_error, rows) {					
					  console.log(this.sql);
					  console.log(rows);
					  if (location_error){ 
							reject(location_error);
					  }else{               
							resolve("Location updated successfully");
					  }
					
                })
        

        } catch (e) {
            reject(e);
        }
    });
    
};

let SaveLocation = (req) => {
	return new Promise(async (resolve, reject) => {
	
        try {
         
                //hash location's password
               
				let location_name = req.body.location_name;
				let location_code = req.body.location_code;
				let operator_id = req.body.operator_id;
				let address = req.body.address;
				let city = req.body.city;
				let state = req.body.state;
				let zip = req.body.zip;
				let status = req.body.status;
				let test_site = req.body.test_site;
			
				let created_at = moment().format('YYYY-MM-DD  h:mm:ss');
				
                //create a new location
				var insert_query = "INSERT INTO locations(operator_id,location_code,name,address,city,state,zip,status,test_site,created_at) VALUES (?,?,?,?,?,?,?,?,?,?) ";
                connection.query(insert_query,[operator_id,location_code,location_name,address,city,state,zip,status,test_site,created_at], function(location_error, rows) {
						console.log(this.sql);
						console.log(location_error);
					 
					  
					  if (location_error){ 
						reject(location_error);
					  }else{	
							resolve("location created successfully");
					  }
					
                })
          
          

        } catch (e) {
            reject(e);
        }
    });
    
};






module.exports = {    
	createLocation:createLocation,
	deleteLocation:deleteLocation,
	updateLocation:updateLocation
	
};
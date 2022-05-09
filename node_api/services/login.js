 require('../config/connectDB');
var bcrypt = require('bcryptjs');
var moment = require('moment'); // require
moment().format(); 

var crypto = require('crypto');
function createNewUser(req,res){
	    var msg =   SaveNewUser(req).then(function(response) {
      //here when you resolve
		console.log(response);
		req.flash('message',response);
		res.redirect('/users/list');
      })
    .catch(function(rej) {
      //here when you reject the promise
    console.log(rej);
	req.flash('message',rej);	
	res.redirect('/users/create');
    });
	
	
}

function deleteUser(id){
	user_delete_query = "DELETE FROM users  WHERE id = ?";
	connection.query(user_delete_query,[id],function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }else{			 
			 return '1';
		 }
	
   });
	
}

function updateUser(req){
	 return  updateUserData(req).then(function() {
      //here when you resolve
      })
    .catch(function(rej) {
      //here when you reject the promise
      console.log(rej);
    });
	
}


let updateUserData = (req) => {
	return new Promise(async (resolve, reject) => {
		
        try {
				console.log(req.body);
			   let user_id = req.params.id;           
                
				let role = req.body.role;
                let isAdmin = (req.body.role==1)?1:0;
				var data = new Array();
				if(req.body.password!=""){
					let salt = bcrypt.genSaltSync(10);
					data['password'] = bcrypt.hashSync(req.body.password, salt);
				} 
				data['first_name'] = req.body.first_name;
				data['last_name'] = req.body.last_name;
				data['company'] = req.body.company_name;
				data['confirmed'] = req.body.confirmed;
				data['admin'] = isAdmin;			
				data['updated_at'] =   moment().format('YYYY-MM-DD  h:mm:ss');
console.log(data);		
				var user_data = Object.assign({}, data);
console.log(user_data);
                //update user
                connection.query("UPDATE users set ? WHERE id = ?", [user_data,user_id], function(user_error, rows) {					
						console.log(this.sql);
					  console.log(rows);
					  if (user_error){ 
							reject(user_error);
					  }else{               
							resolve("User updated successfully");
					  }
					
                })
        

        } catch (e) {
            reject(e);
        }
    });
    
};

let SaveNewUser = (req) => {
	return new Promise(async (resolve, reject) => {
		let email = req.body.email;
        try {
            let check = await checkEmailUser(req.body.email);
		
            if(check === false) {
                //hash user's password
                let salt = bcrypt.genSaltSync(10);
				let role = req.body.role;
                let isAdmin = (req.body.role==1)?1:0;
				var data = new Array(); 
			
				data["first_name"]= req.body.first_name;
				data["last_name"]=req.body.last_name;
				data["username"]=req.body.email;	
				data["company"]= req.body.company_name;
				data["email"]= req.body.email;
				data["password"]= bcrypt.hashSync(req.body.password, salt);
				data["confirmed"]= req.body.confirmed;
				data["admin"] = isAdmin;
				data["created_at"] = moment().format('YYYY-MM-DD  h:mm:ss');
				
				console.log(data);
                //create a new user
				var insert_query = "INSERT INTO users(first_name,last_name,username,company,email,password,confirmed,admin,created_at) VALUES (?,?,?,?,?,?,?,?,?) ";
                connection.query(insert_query,[data["first_name"],data["last_name"],data["username"],data["company"],data["email"],data["password"],data["confirmed"],data["admin"],data["created_at"]], function(user_error, rows) {
					console.log(this.sql);
						console.log(user_error);
					 
					  
					  if (user_error){ 
						reject(user_error);
					  }else{	
							let last_insert_id = rows.insertId;		
console.log("Last Insert User ID :"+last_insert_id);			
						    role_data = {role_id:role,user_id:last_insert_id};
							connection.query("INSERT INTO role_user set ? ", role_data, function(role_error, rows) {
								 if (role_error){ 
									reject(role_error);
								  }
							})                   
							resolve("User created successfully");
					  }
					
                })
            }
            if(check === true)
                reject(`The email ${email} has already exist. Please choose another email`)

        } catch (e) {
            reject(e);
        }
    });
    
};


let checkEmailUser = (email) => {
return new Promise((resolve, reject) => {
    try{
        connection.query("SELECT * from users where email = ?", email, function(error, rows) {
            if(error) reject(error);
            if(rows.length > 0) resolve(true);
            resolve(false);
        })
    }catch (e) {
        reject(e);
    }
});
};
 





module.exports = {
    checkEmailUser: checkEmailUser,
	createNewUser:createNewUser,
	deleteUser:deleteUser,
	updateUser:updateUser
	
};
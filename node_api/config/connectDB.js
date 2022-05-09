
//Database Connection Start from here
var mysql = require('mysql');

var db_config = {
	host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
};
console.log(db_config);


	con = mysql.createConnection(db_config);

	con.connect(function(err) {
		if (err) {
			console.log("Database Connection didnt happen because : ", err);
			setTimeout(handleDisconnect, 1000);
		}
	});

	// This handler is for when the connection is lost for some strange reason.
	// Now there is no reason to wait - just call handleDisconnect again - 
	// but do this only when the error is Protocol Connection Lost. For any other
	// errors - simply bail, dont try anything clever.
	con.on('error', function(err) {
		console.log('db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST')  {
			handleDisconnect();
		} else {
			throw err;
		}
	});

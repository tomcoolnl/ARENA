/**
 * Index DB Support	- Chrome FireFox
 * WebSQL Support 	- Safari, Chrome, Opera
 * 
 * object based - return object
 * success / error handlers
 * 
 * fallback to localStorage for IE8 (and 9?)
 * 
 * 
 * 
 */
;var DAO = (function (window) {
	
	'use strict';

	var db 		= null,
		name	= 'AmBisome',
		dataId 	= 1,
	
	sql = {
		CREATE 	: "CREATE TABLE "+ name +" (id REAL UNIQUE, json TEXT )",
		INSERT 	: "INSERT INTO "+ name +" (id, json ) VALUES ( ?, ?)",
		UPDATE 	: "UPDATE "+ name +" SET json = ? WHERE id = ?",
		GET 	: "SELECT json FROM "+ name,
		COUNT 	: "SELECT COUNT(*) FROM "+ name
	},
	
	_ = {
		
		checkIfDBInitialized : function () {
			db.transaction(function(tx) {
				tx.executeSql(
					sql.COUNT, 
					[], 
					function(tx, result) { }, 
					function(tx, error) {
						tx.executeSql(sql.CREATE, [], function(result) {
							// create our single row
							tx.executeSql(sql.INSERT, [dataId, "[]"]);
						});
					}
				);
			});
		}

	};

	return {
		
		load : function (callback) {
			db.transaction( function(tx) {
				tx.executeSql(
					sql.GET, 
					[], 
					function(tx, result) {
						if (result.rows.length > 0) {
							var row = result.rows.item(0);
							var json = row['json'];
							if( typeof callback === 'function') {
								callback.apply({}, [json]);
							};
						};
					}, 
					function(tx, error) {
						alert("Failed to retrieve data : " + error.message);
						return;
					}
				);
			});
		}, 
		
		save : function ( json, callback ) {
			db.transaction(function(tx) {
				tx.executeSql(sql.UPDATE, [json, dataId], callback);
			});
		},
		
		init : function ( callback ) {
			try {
				if (window.openDatabase) {
					
					db = openDatabase(name + ' Storage', '1.0', name + ' Database', 2200000);
					
					_.checkIfDBInitialized();
					
					if (!db) {
						alert('Failed to open the database.');
					} else {
						if ( typeof callback === 'function') {
							callback.apply({}, []);
						};
					};
				};
			} catch ( error ) {
				alert('Error trying to open database : ' + error);
			};
		}

	};
}(this));
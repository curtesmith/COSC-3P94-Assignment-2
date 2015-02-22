/**
 * 
 */
var db;

function indexedDBOk() {
	return "indexedDB" in window;
}

document.getElementById("add").onclick = addPerson;

document.addEventListener("DOMContentLoaded", function() {

	// No support? Go in the corner and pout.
	if (!indexedDBOk)
		return;

	var openRequest = indexedDB.open("cosc.3P94.assignment2", 1);

	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;

		if (!thisDB.objectStoreNames.contains("customers")) {
			var os = thisDB.createObjectStore("customers");
			os.createIndex("clientId", "clientId", {
				unique : true
			});
		}

		if (!thisDB.objectStoreNames.contains("session")) {
			var os = thisDB.createObjectStore("session");
			os.createIndex("clientId", "clientId", {
				unique : true
			});
		}

	}

	openRequest.onsuccess = function(e) {
		console.log("running onsuccess");

		db = e.target.result;

		// Listen for add clicks

	}

	openRequest.onerror = function(e) {
		// Do something for the error
	}

}, false);

function addPerson(e) {
	var client_id = document.querySelector("#client_id").value;
	var PIN = document.querySelector("#PIN").value;
	var surname = document.querySelector("#surname").value;
	var given_name = document.querySelector("#given_name").value;
	var checking_balance = document.querySelector("#checking_balance").value;
	var savings_balance = document.querySelector("#savings_balance").value;

	console.log("About to add " + surname + "/" + given_name);

	var transaction = db.transaction([ "customers" ], "readwrite");
	var store = transaction.objectStore("customers");

	// Define a person
	var person = {
		clientId : client_id,
		PIN : PIN,
		surname : surname,
		givenName : given_name,
		checkingBalance : checking_balance,
		savingsBalance : savings_balance,
		created : new Date()
	}

	// Perform the add
	var request = store.add(person, client_id);

	request.onerror = function(e) {
		console.log("Error", e.target.error.name);
		// some type of error handler
	}

	request.onsuccess = function(e) {
		console.log("Woot! Did it");
	}
}

function getPerson(e) {
	var key = document.querySelector("#account").value;
	if (key === "" || isNaN(key))
		return;

	var transaction = db.transaction([ "customers" ], "readonly");
	var store = transaction.objectStore("customers");
	var index = store.index("client_id");

	var request = index.get(key);

	request.onsuccess = function(e) {

		var result = e.target.result;
		console.dir(result);
		if (result) {
			var s = "&lt;h2>Key " + key + "&lt;/h2>&lt;p>";
			for ( var field in result) {
				s += field + "=" + result[field] + "&lt;br/>";
			}
			alert(s);
		} else {
			alert("no match");
		}
	}
}
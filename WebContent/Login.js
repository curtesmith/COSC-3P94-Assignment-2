/**
 * 
 */
var db = new Database();
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connect(window);
	g("login").onclick = login;
}

function login(e) {
	var clientId = g("account").value;
	var customer = new Customer(db);
	customer.getByClientId(clientId, function(e) {
		if (e.target.result) {
			gotoMain(e)
		} else {
			showError();
		}
	});
}

function gotoMain(e) {
	var result = e.target.result;

	var customer = new Customer(db)
	customer.fill(result);

	var session = new Session(db);
	session.update(customer, function(e) {
		location.replace("Main.html");
	});
}

function showError() {
	alert("no match");
}
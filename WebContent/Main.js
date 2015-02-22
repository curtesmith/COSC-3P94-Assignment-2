/**
 * 
 */
var db = new Database();
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connectWithCallback(window, updatePage)
	document.getElementById("done_button").onclick = done;
}

function updatePage(e) {
	var session = new Session(db);
	session.get(function(e) {
		var customer = new Customer(db);
		customer.fill(e.target.result.value);
		g("welcome_message").innerHTML = "Welcome " + customer.givenName + ".";
		g("checking_balance").innerHTML = "Checking balance: $" + customer.checkingBalance;
		g("savings_balance").innerHTML = "Savings balance: $" + customer.savingsBalance;		
	});
}

function done() {
	var session = new Session(db);
	session.clear(function(e) {
		location.replace("Login.html");
	});
}
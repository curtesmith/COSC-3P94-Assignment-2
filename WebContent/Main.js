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
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	var cc = today.getMonth()+2;

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 
	today = mm+'/'+dd+'/'+yyyy;
	credit = cc+'/'+dd+'/'+yyyy;
	var dates = document.querySelectorAll("div.date");

for (i=0; i < dates.length; i++) {
dates[i].innerHTML = "As of: " + today;
}
		var customer = new Customer(db);
		customer.fill(e.target.result.value);
		g("welcome_message").innerHTML = "Welcome " + customer.givenName + ".";
		g("checking_balance").innerHTML = "Checking balance: $" + customer.checkingBalance;
		g("savings_balance").innerHTML = "Savings balance: $" + customer.savingsBalance;
		g("credit_card").innerHTML = "Credit Card balance: $" + customer.creditCard;
		g("ccDate").innerHTML = "Next payment date: " + credit;
	});
}

function done() {
	var session = new Session(db);
	session.clear(function(e) {
		location.replace("Login.html");
	});
}
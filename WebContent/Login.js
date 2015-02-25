/**
 * 
 */
var db = new Database();
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connect(window);
	$("login").onclick = login;
	$("account_number").onkeydown = inputChanged;
	$("pin").onkeydown = inputChanged;
	
	window.onkeydown = keyPressed;
	$("account_number").focus();
}

function login(e) {
	var clientId = $("account_number").value;
	var customer = new Customer(db);
	customer.getByClientId(clientId, function(e) {
		if (e.target.result && isValidPIN(e.target.result)) {
			gotoMain(e)
		} else {
			showError();
		}
	});
}

function isValidPIN(result) {
	var customer = new Customer(db);
	customer.fill(result);
	 return $("pin").value == customer.PIN;
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

function inputChanged(e) {
	e.target.className = "";
}


function keyPressed(e) {
	if(e.keyCode == 13) {
		e.preventDefault();
		login(e);
	}
}

function showError() {
	alert("Invalid Account Number and PIN combination. Please try again.");
	$("account_number").className = "error";
	$("pin").className = "error";
	$("account_number").focus();
}
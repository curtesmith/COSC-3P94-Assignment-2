/**
 * 
 */
var db = new Database();
var customer = null;
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connectWithCallback(window, updatePage);
	g("done_button").onclick = done;
	g("withdraw_button").onclick = withdrawClick;
	g("withdraw_amount").onkeyup = amountChanged;
	g("1").onclick = fastWithdrawClick;
	g("2").onclick = fastWithdrawClick;
	g("3").onclick = fastWithdrawClick;

	var radios = document.getElementsByName("withdraw_account_radio");
	for (var i = 0; i < radios.length; i++) {
		radios[i].onchange = radioAccountSelected;
	}

	window.onkeydown = keyPressed;
}

function updatePage(e) {
	var session = new Session(db);
	session
			.get(function(e) {
				customer = new Customer(db);
				customer.fill(e.target.result.value);
				g("welcome_message").innerHTML = "Welcome "
						+ customer.givenName + ".";
				g("checking_balance").innerHTML = "Checking balance: $"
						+ customer.checkingBalance;
				g("savings_balance").innerHTML = "Savings balance: $"
						+ customer.savingsBalance;
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1; // January is 0!
				var yyyy = today.getFullYear();
				var cc = today.getMonth() + 2;

				if (dd < 10) {
					dd = '0' + dd
				}

				if (mm < 10) {
					mm = '0' + mm
				}
				today = mm + '/' + dd + '/' + yyyy;
				credit = cc + '/' + dd + '/' + yyyy;
				var dates = document.querySelectorAll("div.date");

				for (i = 0; i < dates.length; i++) {
					dates[i].innerHTML = "As of: " + today;
				}
				g("credit_card").innerHTML = "Credit Card balance: $"
						+ customer.creditCard;
				g("ccDate").innerHTML = "Next payment date: " + credit;

				g("savings_label").innerHTML = "Savings $"
						+ customer.savingsBalance;
				g("checking_label").innerHTML = "Checking $"
						+ customer.checkingBalance;
				
				updateFastWithdrawButtons(customer.checkingBalance);

				g("withdraw_amount").value = "";
				g("withdraw_amount").disabled = true;
			});
}

function createWithdrawBalanceOption(name, balance) {
	o = document.createElement("option");
	o.text = name + ": $" + balance;
	o.value = balance;
	return o;
}

function radioAccountSelected(e) {
	if (e.target.value == "Checking") {
		balance = customer.checkingBalance;
	} else {
		balance = customer.savingsBalance;
	}

	updateFastWithdrawButtons(balance);
}

function updateFastWithdrawButtons(balance) {
	g("1").disabled = parseFloat(balance) < parseFloat(g("1").value);
	g("2").disabled = parseFloat(balance) < parseFloat(g("2").value);
	g("3").disabled = parseFloat(balance) < parseFloat(g("3").value);
}

function amountChanged(e) {
	var amount = parseFloat(e.target.value);

	if (isNaN(amount) || amount <= 0) {
		g("withdraw_button").disabled = true;
		g("message").innerHTML = "Enter an amount that is greater than zero";
		return;
	}

	var selectedIndex = g("withdraw_account_select").selectedIndex;
	var balance = 0;

	if (selectedIndex == 1) {
		balance = customer.checkingBalance;
	} else {
		balance = customer.savingsBalance;
	}

	if (amount > balance) {
		g("withdraw_button").disabled = true;
		g("message").innerHTML = "Enter an amount that is less than or equal to the account balance, $"
				+ balance;
		return;
	}

	g("message").innerHTML = "";
	g("withdraw_button").disabled = false;
}

function done() {
	location.replace("Main.html");
}

function keyPressed(e) {
	if (e.keyCode >= 48 && e.keyCode <= 57) {
		number_write(e.keyCode % 48);
	} else if (e.keyCode == 8) {
		e.preventDefault();
		number_c();
	} else if (e.keyCode == 13) {
		e.preventDefault();
		withdrawClick(e);
	}
}

function fastWithdrawClick(e) {
	withdraw(parseFloat(e.target.value));
}

function withdrawClick(e) {
	withdraw(parseFloat(g("withdraw_amount").value));
}

function withdraw(amount) {
	var selected = getSelectedAccount();

	if (selected == "Checking") {
		customer.checkingBalance = parseFloat(customer.checkingBalance)
				- amount;
		customer.savingsBalance = parseFloat(customer.savingsBalance) + amount;
		alert("Transfer from checking account was successful.\nNew balance is $"
				+ customer.checkingBalance);
	} else {
		customer.savingsBalance = parseFloat(customer.savingsBalance) - amount;
		customer.checkingBalance = parseFloat(customer.checkingBalance) + amount;
		alert("Transfer from savings account was successful.\nNew balance is $"
				+ customer.savingsBalance);
	}

	var session = new Session(db);
	customer.update(session.update(customer, updatePage));
}

function getSelectedAccount() {
	var radios = document.getElementsByName("withdraw_account_radio");
	var selected = "";
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			selected = radios[i].value;
		}
	}

	return selected;
}

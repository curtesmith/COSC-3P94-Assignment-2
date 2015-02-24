/**
 * 
 */
var db = new Database();
var customer = null;
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connectWithCallback(window, updatePage);
	$("done_button").onclick = done;
	$("withdraw_button").onclick = withdrawClick;
	$("1").onclick = fastWithdrawClick;
	$("2").onclick = fastWithdrawClick;
	$("3").onclick = fastWithdrawClick;

	var radios = $name("withdraw_account_radio");
	for (var i = 0; i < radios.length; i++) {
		radios[i].onchange = radioAccountSelected;
	}

	window.onkeydown = keyPressed;
}

function resetMessage() {
	$("message").innerHTML = "";
}

function updatePage(e) {
	var session = new Session(db);
	session
			.get(function(e) {
				customer = new Customer(db);
				customer.fill(e.target.result.value);
				$("welcome_message").innerHTML = "Welcome "
						+ customer.givenName + ".";
				$("checking_balance").innerHTML = "Checking balance: $"
						+ customer.checkingBalance;
				$("savings_balance").innerHTML = "Savings balance: $"
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
				$("credit_card").innerHTML = "Credit Card balance: $"
						+ customer.creditCard;
				$("ccDate").innerHTML = "Next payment date: " + credit;

				$("savings_label").innerHTML = "Savings $"
						+ customer.savingsBalance;
				$("checking_label").innerHTML = "Checking $"
						+ customer.checkingBalance;

				updateFastWithdrawButtons(getSelectedBalance());

				$("withdraw_amount").value = "";
				$("withdraw_amount").disabled = true;
			});
}

function radioAccountSelected(e) {
	resetMessage();
	updateFastWithdrawButtons(getSelectedBalance());
}

function updateFastWithdrawButtons(balance) {
	$("1").disabled = parseFloat(balance) < parseFloat($("1").value);
	$("2").disabled = parseFloat(balance) < parseFloat($("2").value);
	$("3").disabled = parseFloat(balance) < parseFloat($("3").value);
}

function amountChanged(e) {
	var amount = parseFloat(e.target.value);

	if (isNaN(amount) || amount <= 0) {
		$("withdraw_button").disabled = true;
		$("message").innerHTML = "Enter an amount that is greater than zero";
		return;
	}

	var selectedIndex = $("withdraw_account_select").selectedIndex;
	var balance = 0;

	if (selectedIndex == 1) {
		balance = customer.checkingBalance;
	} else {
		balance = customer.savingsBalance;
	}

	if (amount > balance) {
		$("withdraw_button").disabled = true;
		$("message").innerHTML = "Enter an amount that is less than or equal to the account balance, $"
				+ balance;
		return;
	}

	$("message").innerHTML = "";
	$("withdraw_button").disabled = false;
}

function done() {
	location.replace("Main.html");
}

function keyPressed(e) {
	resetMessage();

	if (e.keyCode >= 48 && e.keyCode <= 57) {
		handleNumber(e.keyCode % 48);
	} else if (e.keyCode == 8) {
		e.preventDefault();
		number_c();
	} else if (e.keyCode == 13) {
		e.preventDefault();
		withdrawClick(e);
	}
}

function handleNumber(key) {
	var value = parseFloat($("withdraw_amount").value);
	if (isNaN(value))
		value = 0;

	var newValue = (value * 10) + key;

	if (newValue <= getSelectedBalance()) {
		$("withdraw_amount").value = newValue;
	} else {
		$("message").innerHTML = "You cannot withdraw more than $"
				+ getSelectedBalance() + " from " + getSelectedAccount();
	}
}

function getSelectedBalance() {
	if (getSelectedAccount() == "Checking") {
		return customer.checkingBalance;
	} else {
		return customer.savingsBalance;
	}
}

function fastWithdrawClick(e) {
	resetMessage();
	withdraw(parseFloat(e.target.value));
}

function withdrawClick(e) {
	resetMessage();
	withdraw(parseFloat($("withdraw_amount").value));
}

function withdraw(amount) {
	var selected = getSelectedAccount();

	if (selected == "Checking") {
		customer.checkingBalance = withdrawFromAccount(amount, selected,
				customer.checkingBalance);
	} else {
		customer.savingsBalance = withdrawFromAccount(amount, selected,
				customer.savingsBalance);
	}

	var session = new Session(db);
	customer.update(session.update(customer, updatePage));
}

function withdrawFromAccount(amount, account, balance) {
	balance = parseFloat(balance) - amount;
	alert("Withdraw $" + amount + " from " + account
			+ " account was successful.\nNew balance is $" + balance);
	return balance;
}

function getSelectedAccount() {
	var radios = $name("withdraw_account_radio");
	var selected = "";
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			selected = radios[i].value;
		}
	}

	return selected;
}

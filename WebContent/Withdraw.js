/**
 * 
 */
var db = new Database();
var customer = null;
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connectWithCallback(window, updatePage);
	g("done_button").onclick = done;
	g("withdraw_button").onclick = withdraw;
	g("withdraw_account_select").onchange = accountSelected;
	g("withdraw_amount").onkeyup = amountChanged;
}

function updatePage(e) {
	var session = new Session(db);
	session.get(function(e) {
		customer = new Customer(db);
		customer.fill(e.target.result.value);
		g("welcome_message").innerHTML = "Welcome " + customer.givenName + ".";
		g("checking_balance").innerHTML = "Checking balance: $"
				+ customer.checkingBalance;
		g("savings_balance").innerHTML = "Savings balance: $"
				+ customer.savingsBalance;

		g("withdraw_account_select").innerHTML = "<option>Choose an account...</option>";

		g("withdraw_account_select").add(
				createWithdrawBalanceOption("Checking balance",
						customer.checkingBalance));
		g("withdraw_account_select").add(
				createWithdrawBalanceOption("Savings balance",
						customer.savingsBalance));

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

function accountSelected(e) {
	if (e.target.selectedIndex > 0) {
		g("withdraw_amount").disabled = false;
		g("withdraw_amount").focus();
	} else {
		g("withdraw_amount").disabled = true;
		g("withdraw_button").disabled = true;
	}
}

function amountChanged(e) {
	var amount = parseFloat(e.target.value);

	if (isNaN(amount) || amount <= 0) {
		g("withdraw_button").disabled = true;
		g("message").innerHTML = "Enter an amount that is greater than zero";
	} else {
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
		} else {
			g("message").innerHTML = "";
			g("withdraw_button").disabled = false;
		}
	}
}

function done() {
	location.replace("Main.html");
}

function withdraw(e) {
	var selectedIndex = g("withdraw_account_select").selectedIndex;
	var amount = parseFloat(g("withdraw_amount").value);

	if (selectedIndex == 1) {
		customer.checkingBalance = parseFloat(customer.checkingBalance)
				- parseFloat(g("withdraw_amount").value);
		alert("Withdraw from checking account was successful.\nNew balance is $"
				+ customer.checkingBalance);
	} else if (selectedIndex == 2) {
		customer.savingsBalance = parseFloat(customer.savingsBalance)
				- parseFloat(g("withdraw_amount").value);
		alert("Withdraw from savings account was successful.\nNew balance is $"
				+ customer.savingsBalance);
	}

	var session = new Session(db);

	customer.update(session.update(customer, updatePage));

}
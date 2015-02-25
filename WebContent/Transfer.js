/**
 * 
 */
var db = new Database();
var customer = null;
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connectWithCallback(window, updatePage);
	$("done_button").onclick = done;
	$("transfer_button").onclick = withdrawClick;

	$("1").onclick = fastWithdrawClick;
	$("2").onclick = fastWithdrawClick;
	$("3").onclick = fastWithdrawClick;

	var radios = $name("transfer_account_radio");
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
				//Select account to transfer from
				$("savings_label").innerHTML = "Savings: $"
						+ customer.savingsBalance;
				$("checking_label").innerHTML = "Checking: $"
						+ customer.checkingBalance;
				
				//Get account to transfer money too	
				$("savings_too").innerHTML = "Savings: $"
						+ customer.savingsBalance;
				$("checking_too").innerHTML = "Checking: $"
						+ customer.checkingBalance;
				$("credit_too").innerHTML = "Credit: $"
						+ customer.creditCard;

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

function done() {
	location.replace("Main.html");
}

function keyPressed(e) {
	resetMessage();

	if (e.keyCode >= 48 && e.keyCode <= 57) {
		handleNumber(e.keyCode % 48);
	} else if (e.keyCode == 8) {
		e.preventDefault();
		handleClear();
	} else if (e.keyCode == 13) {
		e.preventDefault();
		withdrawClick(e);
	}
}

function handleClear() {
	var num = $("withdraw_amount").value;
	var num1 = num % 10;
	num -= num1;
	num /= 10;
	$("withdraw_amount").value = num;
}

function handleNumber(key) {
	var value = parseFloat($("withdraw_amount").value);
	if (isNaN(value))
		value = 0;

	var newValue = (value * 10) + key;

	if (newValue <= getSelectedBalance()) {
		$("withdraw_amount").value = newValue;
	} else {
		$("message").innerHTML = "You cannot transfer more than $"
				+ getSelectedBalance() + " from " + getSelectedAccount();
	}
}

function getSelectedBalance() {
	if (getSelectedAccount() == "Checking") {
		return customer.checkingBalance;
	}else {
		return customer.savingsBalance;
	}
}

function fastWithdrawClick(e) {
	resetMessage();
	withdraw(parseFloat(e.target.value));
}

function withdrawClick(e) {
	resetMessage();
	withdraw(parseFloat(g("withdraw_amount").value));
}

function withdraw(amount) {
	var selected = getSelectedAccount();
	var transferToo = getSelectedAccountToo();
	
	if (selected == "Checking" && transferToo == "Savings2") {
		
		customer.checkingBalance = parseFloat(customer.checkingBalance)	- amount;
		customer.savingsBalance = parseFloat(customer.savingsBalance) + amount;
		alert("Transfer from checking account to savings was successful.\nNew savings balance is $"
				+ customer.savingsBalance);
		}
	else if (selected == "Checking" && transferToo == "Credit2")	{
	
		customer.checkingBalance = parseFloat(customer.checkingBalance)	- amount;
		customer.creditCard = parseFloat(customer.creditCard) + amount;
		alert("Transfer from checking account to credit was successful.\nNew credit balance is $"
				+ customer.creditCard);
	
				
	} else if(selected == "Savings" && transferToo == "Checking2"){
		
		customer.savingsBalance = parseFloat(customer.savingsBalance) - amount;
		customer.checkingBalance = parseFloat(customer.checkingBalance)	+ amount;
		alert("Transfer from savings account to checking was successful.\nNew checking balance is $"
				+ customer.checkingBalance);
	}
	else if(selected == "Savings" && transferToo == "Credit2"){
	
		customer.savingsBalance = parseFloat(customer.savingsBalance) - amount;
		customer.creditCard = parseFloat(customer.creditCard) + amount;
		alert("Transfer from savings account to credit was successful.\nNew credit balance is $"
				+ customer.creditCard);
	}
	else{
		alert("Please select another account to transfer too");		
	}

	var session = new Session(db);
	customer.update(session.update(customer, updatePage));
}

function getSelectedAccount() {
	var radios = $name("transfer_account_radio");
	var selected = "";
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			selected = radios[i].value;
		}
	}

	return selected;
}
function getSelectedAccountToo() {
	var radios = $name("transfer_too");
	var transferToo = "";
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			transferToo = radios[i].value;
		}
	}

	return transferToo;
}

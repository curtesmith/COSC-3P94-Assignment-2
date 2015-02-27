var db = new Database();
var customer = null;
var depositBox = $("deposit_amount1");
document.addEventListener("DOMContentLoaded", setup, false);

function setup() {
	db.connectWithCallback(window, updatePage);
	$("done_button").onclick = done;
	$("deposit_button").onclick = depositClick;

	var radios = $name("deposit_account_radio");
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

				$("deposit_amount1").value = "0";
				$("deposit_amount1").disabled = true;
				$("deposit_amount2").value = "0";
				$("deposit_amount2").disabled = true;
				$("deposit_amount3").value = "0";
				$("deposit_amount3").disabled = true;
				$("deposit_amount4").value = "0";
				$("deposit_amount4").disabled = true;
			});
}

function done() {
	location.replace("Main.html");
}

function radioAccountSelected(e) {
	resetMessage();
}



function getSelectedBalance() {
	if (getSelectedAccount() == "Checking") {
		return customer.checkingBalance;
	} else {
		return customer.savingsBalance;
	}
}

function depositClick(e) {
	resetMessage();
	deposit(parseFloat($("deposit_amount1").value) + parseFloat($("deposit_amount2").value) + 
		parseFloat($("deposit_amount3").value) + parseFloat($("deposit_amount4").value));
}

function deposit(amount) {
	var selected = getSelectedAccount();

	if (selected == "Checking") {
		customer.checkingBalance = depositToAccount(amount, selected,
				customer.checkingBalance);
	} else {
		customer.savingsBalance = depositToAccount(amount, selected,
				customer.savingsBalance);
	}

	var session = new Session(db);
	customer.update(session.update(customer, updatePage));
}

function depositToAccount(amount, account, balance) {
	balance = parseFloat(balance) + amount;
	alert("Deposit $" + amount + " to " + account
			+ " account was successful.\nNew balance is $" + balance);
	return balance;
}

function getSelectedAccount() {
	var radios = $name("deposit_account_radio");
	var selected = "";
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			selected = radios[i].value;
		}
	}

	return selected;
}

function deposit_select(x){
	switch(x){
		case 1:
			depositBox = $("deposit_amount1");
			break;
		case 2:
			depositBox = $("deposit_amount2");
			break;
		case 3:
			depositBox = $("deposit_amount3");
			break;
		case 4:
			depositBox = $("deposit_amount4");
			break;
	}

}

function number_write(x) {
	var text_box = depositBox;
	if (x >= 0 && x <= 9) {
		if (isNaN(text_box.value))
			text_box.value = 0;
		text_box.value = (text_box.value * 10) + x;
	}
}


function number_c() {
	var text_box = depositBox;
	var num = text_box.value;
	var num1 = num % 10;
	num -= num1;
	num /= 10;
	text_box.value = num;
}
/**
 * 
 */

function Customer(db) {
	var DAL = db;
	this.PIN = null;
	this.checkingBalance = null;
	this.clientId = null;
	this.created = null;
	this.givenName = null;
	this.savingsBalance = null;
	this.surname = null;

	Customer.prototype.getByClientId = getByClientId;
	Customer.prototype.fill = fill;
	Customer.prototype.update = update;

	function getByClientId(clientId, callback) {
		if (clientId === "" || isNaN(clientId))
			return;

		var request = DAL.selectCustomerByClientId(clientId);
		request.onsuccess = callback;
	}

	function fill(data) {
		this.PIN = data["PIN"];
		this.checkingBalance = data["checkingBalance"];
		this.clientId = data["clientId"];
		this.created = data["created"];
		this.givenName = data["givenName"];
		this.savingsBalance = data["savingsBalance"];
		this.surname = data["surname"];
	}
	
	function update(callback){
		DAL.updateCustomer(this, callback);
	}
};
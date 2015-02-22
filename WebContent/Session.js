/**
 * 
 */
function Session(db) {
	var DAL = db;

	Session.prototype.update = update;
	Session.prototype.clear = clear;
	Session.prototype.get = get;

	function update(customer, callback) {
		clear(function(e) {
			DAL.updateSessionWithCallback(customer, callback);
		});
	}

	function clear(callback) {
		DAL.clearSessionWithCallback(callback);
	}

	function get(callback) {
		DAL.getSession(callback);
	}
}
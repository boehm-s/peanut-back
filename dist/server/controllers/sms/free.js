'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require("request");

var randomCode = function randomCode() {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
	var result = '';
	for (var i = 6; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}return result;
};

var Free = function () {
	function Free(obj) {
		_classCallCheck(this, Free);

		this.key = obj.key;
		this.user = obj.user;
		this.pass = null;
		this.sendDate = null;
		this.expire = 120;
		this.remaining = 3;
	}

	_createClass(Free, [{
		key: 'sendPass',
		value: function sendPass() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_this.pass = randomCode();
				_this.remaining = 3;
				request({
					url: 'https://smsapi.free-mobile.fr/sendmsg',
					qs: {
						user: _this.user,
						pass: _this.key,
						msg: "Utilisez ce pass : " + _this.pass
					}
				}, function (err, response, body) {
					if (response.statusCode === 200) {
						_this.sendDate = new Date();
						resolve({ success: "true", id: _this.pass });
					}
					reject({ error: "?" });
				});
			});
		}
	}, {
		key: 'checkPass',
		value: function checkPass(pass) {
			if (this.remaining <= 0) return { error: "too much attempt" };else if (this.sendDate !== null) {
				if ((new Date() - this.sendDate) / 1000 < this.expire) {
					// user is auth
					if (this.pass === pass) {
						return { success: "you succeed" };
					} else {
						this.remaining -= 1;
						return { error: "wrong pass" };
					}
				} else {
					return { error: "expired" };
				}
			} else {
				return { error: "message not sent" };
			}
		}
	}]);

	return Free;
}();

module.exports = Free;
//# sourceMappingURL=free.js.map

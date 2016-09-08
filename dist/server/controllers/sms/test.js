"use strict";

var Free = require('./free');

var options = {
	key: "OeAifDVAnOL6bh",
	user: "23066945"
};

var free = new Free(options);

free.sendPass().then(function (res) {
	console.log(res);
});

setTimeout(function () {
	var res = free.checkPass("test");
	console.log(res);
}, 5000);
//# sourceMappingURL=test.js.map

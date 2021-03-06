const request = require("request")

var randomCode = () => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    var result = '';
    for (var i = 6; i > 0; --i) 
    	result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

class Free {
    constructor(obj) {
	this.key = obj.key;
	this.user = obj.user;
	this.pass = null;
	this.sendDate = null;
	this.expire = 120;
	this.remaining = 3;
    }

    sendPass() {
	return new Promise((resolve, reject) => {
	    this.pass = randomCode()
	    this.remaining = 3;
	    request({
		url:'https://smsapi.free-mobile.fr/sendmsg',
		qs: {
		    user: this.user,
		    pass: this.key,
		    msg: "Utilisez ce pass : " + this.pass
		}
	    }, (err, response, body) => {
		if (response.statusCode === 200) {
		    this.sendDate = new Date()
		    resolve({success: "true", id: this.pass})					
		}
		reject({error: "?"})
	    }
		   );

	})
    }


    checkPass(pass) {
    	if (this.remaining <= 0)
    	    return ({error: "too much attempt"})
    	else if (this.sendDate !== null) {
	    if (((new Date() - this.sendDate) / 1000) < this.expire ) {
	    	// user is auth
	    	if (this.pass === pass) {
	    	    return ({success: "you succeed"});
		} else {
		    this.remaining -= 1;
		    return ({error: "wrong pass"});
		}
	    } else {
	    	return ({error: "expired"})
	    }
	} else {
	    return ({error: "message not sent"})
	}
    }
}

module.exports = Free;

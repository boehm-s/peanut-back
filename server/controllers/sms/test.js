const Free = require('./free');

let options = {
	key: "OeAifDVAnOL6bh",
	user: "23066945"
}

let free = new Free(options);

free.sendPass().then((res) => {
	console.log(res)
})

setTimeout(() => {
	const res = free.checkPass("test")
	console.log(res);
}, 5000)
function getDistance(x1, y1, x2, y2) {
	let x = x2 - x1;
	let y = y2 - y1;
	
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}
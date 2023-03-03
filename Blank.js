function Fibonacci(input){
	let n1=0,n2=1,nextnum,series;
  
	series=[];
	nextnum=n1 +n2;
 
	for(let i=0;i<=input;i++){
		n1=n2;
		n2=nextnum;
		nextnum=n1 + n2;
		series.push(nextnum);
	}
	console.log(series)
}

Fibonacci(9);

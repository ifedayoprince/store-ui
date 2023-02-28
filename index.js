let idIndex = 0;
var output = '';

window.onload = ()=>{startApp()};

async function startApp() {
	setConfig();
	
	let form = document.querySelector('form.main');
	
	try {
	var pineData = await window.pine.fetch.get(`https://api-pinocchio.cyclic.app/core/${app.pid}`)
	pineData = pineData.data.url + "/pine-input.json";
	pineData = (await axios.get(pineData)).data;
	
	pineData.forEach((value)=>{
		if(Array.isArray(value)) {
			output += `\n<div class="input-row flex justify-between">\n`;
			value.forEach((v)=>{drawObject(v)});
			output += "</div>"
		} else {
			drawObject(value)
		}
	})
	document.querySelector('#loader').classList.add('hidden');
	form.innerHTML = output;
	form.classList.remove('hidden');
	} catch (e) {
		console.log(e.message)
		document.querySelector('#loader').classList.add('hidden')
		document.querySelector('.error').classList.remove('hidden');
	}
}

function drawObject(e) {
	var out = '';
	if(e.type == 'file') {
		out += `
		<div class="relative z-0 w-full mb-6 group">
			<input class="block w-full text-sm rounded-lg cursor-pointer text-gray-400 outline-none bg-transparent ring-1 ring-gray-400 focus:ring-[#00ff0f] peer" id="file_input_${idIndex}" name="${e.name}" accept="${e.ext.replace(/\|/g,",")}" type="file">
			<label for="file_input_${idIndex}" class="font-medium absolute text-sm text-gray-400 transform -z-15 origin-[0] top-3 hidden peer-focus:block left-2 peer-focus:text-[#00ff0f] scale-75 peer-focus:fade -translate-y-6 bg-[#0e0e0e] px-2">${e.title}</label>
		</div>`
	} else if (e.type == "notepad") {
		out += `
		<div class="relative z-0 w-full mb-6 group">
    		<textarea name="${e.name.trim()}" id="note_input_${idIndex}" class="block py-2.5 h-${e.height} rounded-lg px-2 w-full text-sm bg-transparent appearance-none text-white ring-gray-400 ring-1 border-0 outline-none focus:ring-[#00ff0f] peer" placeholder=" " required></textarea>
    		<label for="note_input_${idIndex}" class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2.5 left-2 -z-15 origin-[0] peer-focus:left-2 peer-focus:text-[#00ff0f] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 bg-[#0e0e0e] px-2">${e.title.trim()}</label>
		</div>`
	} else if (e.type == "options") {
		out += `
		<div class="self relative z-0 w-full mb-6 group ">
			<select name="${e.name.trim()}" id="option_input_${idIndex}" class="border-0 text-sm rounded-lg block w-full p-2.5 bg-transparent placeholder-gray-400 text-white ring-1 ring-gray-400 focus:ring-[#00ff0f] peer">
				 <option selected>Choose</option>
				 ${e.items.map((val)=>{
					return `<option value="${val.key.trim()}">${val.value.trim()}</option>`
				 }).join('\n')}
			</select> 
			<label for="option_input_${idIndex}" class="font-medium absolute text-sm text-gray-400 transform -z-15 origin-[0] top-3 hidden peer-focus:block left-2 peer-focus:text-[#00ff0f] scale-75 peer-focus:fade -translate-y-6 bg-[#0e0e0e] px-2">${e.title.trim()}</label>
		</div>`
	} else {
		out += `
		<div class="relative z-0 w-full mb-6 group">
    		<input type="text" name="${e.name.trim()}" id="float_input_${idIndex}" class="block py-2.5 rounded-lg px-2 w-full text-sm bg-transparent appearance-none text-white ring-gray-400 ring-1 border-0 outline-none focus:ring-[#00ff0f] peer" placeholder=" " required />
    		<label for="float_input_${idIndex}" class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2.5 left-2 -z-15 origin-[0] peer-focus:left-2 peer-focus:text-[#00ff0f] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 bg-[#0e0e0e] px-2">${e.title.trim()}</label>
		</div>`
	}
	
	output += out;
	idIndex++;
}

function setConfig() {
	window.pine = {
		server: "https://api-pinocchio.cyclic.app", 
		API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRheW8iLCJpYXQiOjE2NzY1OTEwODAsImV4cCI6MTY3OTE4MzA4MH0.D7XKf1pAr7wpLZ_Wqw4rXJU5NOsS108u9caZAP0bQYg"
	}
	window.pine.fetch = axios.create({baseUrl: window.pine.server}), 
	window.pine.fetch.defaults.headers.common['Authorization'] = `Bearer ${window.pine.API_KEY}`; 
	
	var urlParams = {};
	const searchParams = new URLSearchParams(window.location.href.split("?")[1]);
	searchParams.forEach((value, key) => {
		urlParams[key] = value;
	});
	window.app.pid = urlParams.pid
//	window.app.params = urlParams;
}

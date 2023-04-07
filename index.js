var idIndex = 0;
var output = '';

window.onload = ()=>{startApp()};

let heightScaler = {
	"smaller":"15vh", 
	"small" : "25vh",
	"normal": "35vh",
	"medium": "50vh", 
	"large" : "60vh",
	"larger": "80vh"
}
async function startApp() {
	setConfig();
	
	let form = document.querySelector('form.main');
	form.onsubmit = (e)=>{
		e.preventDefault();
		
		startSubmit().then(async (full)=>{
		//	console.log(JSON.stringify(full));
			let proto = (await window.pine.fetch.post("https://api-pinocchio.cyclic.app/pine/protocol/new", {pine: window.app.pid, params: full})).data.shortId;
			let prot = document.querySelector('.protocol')
			prot.innerHTML = "¿" + proto + "?";
			document.querySelector('.skelet').classList.add('hidden');
			prot.parentElement.classList.remove('hidden')
			prot.onclick = ()=>{
				PineInput.broadcastProtocol(proto);
			} 
		});
	}
	
	try {
		// let app = {pid: "ee50c320-a0b6-400e-97e2-e9839c2f8c93"} 
	// window.app = app;
	var pineData = await window.pine.fetch.get(`https://api-pinocchio.cyclic.app/core/${app.pid}`)
	window.pine.data = pineData.data;
    
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
	});
	
	output += `
	<div style="bottom:3.5%;right:5%;" class="share-btn absolute px-4">
		<input type="submit" value="Share" style="width:21vw;height:11vw;border-radius:40px;" class="bg-[#00ff0f] px-3 text-sm text-[#212528] py-1.5" />
	</div>`
	document.querySelector('#loader').classList.add('hidden');
	form.innerHTML = output;
	form.classList.remove('hidden');
	} catch (e) {
		console.log(e.message)
		document.querySelector('#loader').classList.add('hidden');
		document.querySelector('.error h2').innerHTML = e.message;
		document.querySelector('.error').classList.remove('hidden');
	}
}

async function startSubmit() {
	var finalObj = {};
	
	let form = document.querySelector('form')
	form.classList.add('hidden');
	document.querySelector('.skelet').classList.remove('hidden');
	
	let notes = form.querySelectorAll('textarea')
	for(var el of notes) {
		var nid = (await window.pine.fetch.post('https://api-pinocchio.cyclic.app/pine/notes/new', {content: el.value}));
		nid = nid.data.id;
		finalObj[el.getAttribute('name')] = nid;
	} 
		let selects = form.querySelectorAll('select')
		for(var el of selects) {
			finalObj[el.getAttribute('name')] = el.value;
		}
		let texts = form.querySelectorAll('input[freestyle]')
		for(var el of texts) {
			finalObj[el.name] = el.value;
		}
		
		let fileEls = form.querySelectorAll('input[type="file"]')
		for(var el of fileEls) {
			let data = new FormData();
			for(var i = 0; i < el.files.length;i++) {
				let file = el.files.item(i)
				data.append('files', file);
			};
			
			var files = (await window.pine.fetch.post('https://api-pinocchio.cyclic.app/file/new', data, {headers:{"cache-control": "no-cache", 'Content-Type': 'multipart/form-data'}}))
			files = files.data.files;
			finalObj[el.getAttribute('name')] = files;
		};
		
	return finalObj;
}

function drawObject(e) {
	var out = '';
	if(e.type == 'file') {
		out += `
		<div class="relative z-0 w-full mb-6 group">
			<input class="block w-full text-sm rounded-lg cursor-pointer text-gray-400 outline-none bg-transparent ring-1 ring-gray-400 focus:ring-[#00ff0f] peer" id="file_input_${idIndex}" name="${e.name}" multiple="true" accept="${e.exts}" type="file">
			<label for="file_input_${idIndex}" class="font-medium absolute text-sm text-gray-400 transform -z-15 origin-[0] top-3 hidden peer-focus:block left-2 peer-focus:text-[#00ff0f] scale-75 peer-focus:fade -translate-y-6 bg-[#212528] px-2">${e.title}</label>
		</div>`
	} else if (e.type == "note") {
		out += `
		<div class="relative z-0 w-full mb-6 group">
    		<textarea name="${e.name.trim()}" id="note_input_${idIndex}" style="height: ${heightScaler[e.height]};white-space: pre;overflow-wrap: normal;overflow-x: scroll;" class="block py-2.5 h-[${e.height}] rounded-lg px-2 w-full text-sm bg-transparent appearance-none text-white ring-gray-400 ring-1 border-0 outline-none focus:ring-[#00ff0f] peer" placeholder=" " required></textarea>
    		<label for="note_input_${idIndex}" class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2.5 left-2 -z-15 origin-[0] peer-focus:left-2 peer-focus:text-[#00ff0f] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 bg-[#212528] px-2">${e.title.trim()}</label>
		</div>`
	} else if (e.type == "options") {
		out += `
		<div class="self relative z-0 w-full mb-6 group ">
			<select name="${e.name.trim()}" id="option_input_${idIndex}" class="border-0 text-sm rounded-lg block w-full p-2.5 bg-transparent placeholder-gray-400 text-white ring-1 ring-gray-400 focus:ring-[#00ff0f] peer">
				 ${e.items.map((val)=>{
					return `<option value="${val.key.trim()}">${val.value.trim()}</option>`
				 }).join('\n')}
			</select> 
			<label for="option_input_${idIndex}" class="font-medium absolute text-sm text-gray-400 transform -z-15 origin-[0] top-3 hidden peer-focus:block left-2 peer-focus:text-[#00ff0f] scale-75 peer-focus:fade -translate-y-6 bg-[#212528] px-2">${e.title.trim()}</label>
		</div>`
	} else {
		let type = e.type;
		out += `
		<div class="relative z-0 w-full mb-6 group">
    		<input type="${(type != 'file') ? type : 'text' }" name="${e.name.trim()}" id="float_input_${idIndex}" class="block py-2.5 rounded-lg px-2 w-full text-sm bg-transparent appearance-none text-white ring-gray-400 ring-1 border-0 outline-none focus:ring-[#00ff0f] peer" placeholder=" " required freestyle />
    		<label for="float_input_${idIndex}" class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2.5 left-2 -z-15 origin-[0] peer-focus:left-2 peer-focus:text-[#00ff0f] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 bg-[#212528] px-2">${e.title.trim()}</label>
		</div>`
	}
	
	output += out;
	idIndex++;
}

function setConfig() {
	window.pine = {
		server: "https://api-pinocchio.cyclic.app", 
		API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBpbm9TdG9yZSIsImlhdCI6MTY3OTgyMzAzOSwiZXhwIjoxNjgyNDE1MDM5fQ.lsi0e7qbuAXpXNDcWu_hcqROp5JaNHVwyC4ckIRetRg"
	}
	window.pine.fetch = axios.create({baseUrl: window.pine.server}), 
	window.pine.fetch.defaults.headers.common['Authorization'] = `Bearer ${window.pine.API_KEY}`; 
	
	var urlParams = {};
	const searchParams = new URLSearchParams(window.location.href.split("?")[1]);
	searchParams.forEach((value, key) => {
		urlParams[key] = value;
	});
	window.app = {};
	window.app["pid"] = urlParams.pid;
}

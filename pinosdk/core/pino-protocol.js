export class PinoResolver {
	constructor() {
		
	}
	async resolve(app, origin, cb) {
		app.fetch('get', `pine.protocol.${origin}`, (data) => {
			app.params = data.protocol.params;
			cb()
		});
	}
}

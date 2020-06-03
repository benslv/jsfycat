const axios = require("axios");
const fs = require("fs");
const mime = require("mime");

class GfycatClient {
	constructor({ clientId, clientSecret }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
	}

	async authenticate() {
		const res = await axios({
			method: "POST",
			url: "https://api.gfycat.com/v1/oauth/token/",
			data: {
				grant_type: "client_credentials",
				client_id: this.clientId,
				client_secret: this.clientSecret,
			},
		});

		this.token = res.data.access_token;
		this.expiresAt = Date.now() + res.data.expires_in;
	}

	async checkToken() {
		if (this.expiresAt >= Date.now()) {
			await this.authenticate();
		}
	}

	async getGfycatInfo(gfyname) {
		await this.checkToken();

		const res = await axios({
			method: "GET",
			url: `https://api.gfycat.com/v1/gfycats/${gfyname}`,
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});

		return res.data;
	}

	async uploadFromUrl(url) {
		await this.checkToken();

		const res = await axios({
			method: "POST",
			url: "https://api.gfycat.com/v1/gfycats/",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
			data: {
				fetchUrl: url,
				noMd5: "true",
			},
		});

		return res.data;
	}

	async getEmptyGfyname() {
		const res = await axios({
			method: "POST",
			url: "https://api.gfycat.com/v1/gfycats/",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return res.data.gfyname;
	}

	async uploadFromFile(filepath) {
		await this.checkToken();
		console.log(this.token);

		const name = await this.getEmptyGfyname();
		console.log(name);

		const stream = fs.createReadStream(filepath);
		const { size } = fs.statSync(filepath);
		console.log(size);
		const type = mime.getType(filepath);
		console.log(type);

		stream.on("error", console.warn);

		await axios({
			method: "PUT",
			url: `https://filedrop.gfycat.com/${name}/`,
			data: stream,
			headers: {
				Authorization: `Bearer ${this.token}`,
				"Content-Type": type,
				"Content-Length": size,
			},
		});

		return name;
	}

	async checkUploadStatus(gfyname) {
		this.checkToken();

		const endpoint = "https://api.gfycat.com/v1/gfycats/fetch/status/" + gfyname;

		const headers = {
			Authorization: `Bearer ${this.token}`,
		};

		const res = await axios.get(endpoint, headers);
		return res.data;
	}
}

module.exports = GfycatClient;

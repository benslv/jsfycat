const axios = require("axios");

class Gfycat {
	constructor({ clientId, clientSecret }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;

		this.authenticate();
	}

	authenticate() {
		const endpoint = "https://api.gfycat.com/v1/oauth/token/";

		const params = {
			grant_type: "client_credentials",
			client_id: this.clientId,
			client_secret: this.clientSecret,
		};

		axios
			.post(endpoint, params)
			.then((res) => {
				this.token = res.access_token;
				this.expiresAt = Date.now() + res.expires_in;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	checkToken() {
		if (this.expiresAt >= Date.now()) {
			this.authenticate();
		}
	}

	getGfycatInfo(gfyname) {
		const endpoint = "https://api.gfycat.com/v1/gfycats/" + gfyname;

		const headers = {
			Authorization: `Bearer ${this.token}`,
		};

		this.checkToken();

		axios
			.get(endpoint, headers)
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async uploadFromUrl(url) {
		const endpoint = "https://api.gfycat.com/v1/gfycats/";

		const params = {
			fetchUrl: url,
			noMd5: "true",
		};

		let response = await axios.post(endpoint, params);
		return await response.data;
	}

	async getEmptyGfyname() {
		const endpoint = "https://api.gfycat.com/v1/gfycats/";

		const headers = {
			"Content-Type": "application/json",
		};

		const response = await axios.post(endpoint, headers);
		return await response.data.gfyname;
	}

	uploadFromFile(filepath) {}
}

module.exports = Gfycat;

const axios = require("axios");
const fs = require("fs");

class Gfycat {
	constructor({ clientId, clientSecret }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;

		this.authenticate();
	}

	async authenticate() {
		const endpoint = "https://api.gfycat.com/v1/oauth/token/";

		const params = {
			grant_type: "client_credentials",
			client_id: this.clientId,
			client_secret: this.clientSecret,
		};

		const response = await axios.post(endpoint, params);
		this.token = response.access_token;
		this.expiresAt = Date.now() + response.expires_in;
	}

	async checkToken() {
		if (this.expiresAt >= Date.now()) {
			await this.authenticate();
		}
	}

	getGfycatInfo(gfyname) {
		const endpoint = "https://api.gfycat.com/v1/gfycats/" + gfyname;

		this.checkToken();

		const headers = {
			Authorization: `Bearer ${this.token}`,
		};

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
		return response.data;
	}

	async getEmptyGfyname() {
		const endpoint = "https://api.gfycat.com/v1/gfycats/";

		const headers = {
			"Content-Type": "application/json",
		};

		const response = await axios.post(endpoint, headers);
		return response.data.gfyname;
	}

	async uploadFromFile(filepath) {
		const endpoint = "https://filedrop.gfycat.com/";

		// Check whether the current access token has expired, refreshing it if needs be.
		await this.checkToken();

		// Include the authorisation token in the request header.
		const headers = {
			Authorization: `Bearer ${this.token}`,
		};

		// Generate an "empty" gfyname for the file to be placed into.
		const gfyname = await this.getEmptyGfyname();

		// Rename the file to generated gfyname.
		fs.renameSync(filepath, `./${gfyname}`);

		// Read the contents of the file into a variable for sending.
		const file = fs.readFileSync(`./${gfyname}`);

		// Make the request.
		const response = await axios.post(endpoint, headers, file);

		return response;
	}

	async checkUploadStatus(gfyname) {
		const endpoint = "https://api.gfycat.com/v1/gfycats/fetch/status/" + gfyname;

		this.checkToken();
		const headers = {
			Authorization: `Bearer ${this.token}`,
		};

		const response = await axios.get(endpoint, headers);
		return response;
	}
}

module.exports = Gfycat;

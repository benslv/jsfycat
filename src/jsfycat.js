const axios = require("axios");
const fs = require("fs");
const mime = require("mime");

class GfycatClient {
	/**
	 * Creates a new instance of the GfycatClient class.
	 * @constructor
	 * @param {string} cliendId - The client ID retrieved from the developer portal.
	 * @param {string} clientSecret - The client secret retrieve from th developer portal.
	 */
	constructor({ clientId, clientSecret }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
	}

	/**
	 * Authenticates the client with the Gfycat API, storing the access token for future requests.
	 * @async
	 * @method
	 */
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
		this.expiresAt = Date.now() + res.data.expires_in; // Calculate the time at which the token should expire.
	}

	/**
	 * Checks if the current access_token has expired, reauthenticating if necessary.
	 * @async
	 * @method
	 */
	async checkToken() {
		if (this.expiresAt >= Date.now()) {
			await this.authenticate();
		}
	}

	/**
	 * Requests and returns a JSON object containing information about a particular gfy.
	 * @async
	 * @method
	 * @param {string} gfyname - The name of the gfy (e.g. "admirabledaringbluewhale"). Can be found in the URL of the gfy you want information about.
	 */
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

	/**
	 * Uploads and creates a new gfy from a provided URL.
	 * @async
	 * @method
	 * @param {string} URL - The direct URL of the media you want to upload to Gfycat.
	 */
	async uploadFromUrl(URL) {
		await this.checkToken();

		const res = await axios({
			method: "POST",
			url: "https://api.gfycat.com/v1/gfycats/",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
			data: {
				fetchUrl: URL,
				noMd5: "true", // Setting this to "true" allows duplicate media to be uploaded to Gfycat without being rejected.
			},
		});

		return res.data;
	}

	/**
	 * Generates an "empty" gfyname (i.e. there will not be any media at that URL).
	 * @async
	 * @method
	 */
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

	/**
	 * Uploads a local file to the Gfycat service.
	 * @async
	 * @method
	 * @param {string} filepath - The filepath to the file you want to upload.
	 */
	async uploadFromFile(filepath) {
		await this.checkToken();

		const name = await this.getEmptyGfyname();

		const stream = fs.createReadStream(filepath);
		const { size } = fs.statSync(filepath);
		const type = mime.getType(filepath);

		const res = await axios({
			method: "PUT",
			url: `https://filedrop.gfycat.com/${name}`,
			data: stream,
			headers: {
				"Content-Type": type,
				"Content-Length": size,
			},
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});

		return res.data;
	}

	/**
	 * Requests and returns information about the status of a specified gfy. Mainly used to check whether a gfy has finished encoding after being uploaded.
	 * @param {string} gfyname - The name of the gfy (e.g. "admirabledaringbluewhale"). Can be found in the URL of the gfy you want information about.
	 */
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

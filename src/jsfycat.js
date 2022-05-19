"use strict";

const axios = require("axios");
const fs = require("fs");
const mime = require("mime");

class GfycatClient {
  /**
   * Creates a new instance of the GfycatClient class.
   * @constructor
   * @param {string} clientId - The client ID retrieved from the developer portal.
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

    // Calculate the time at which the token should expire.
    this.expiresAt = Date.now() + res.data.expires_in;
  }

  /**
   * Checks if the current access_token has expired, reauthenticating if necessary.
   * @async
   * @method
   */
  async checkToken() {
    if (!this.expiresAt || this.expiresAt >= Date.now()) {
      await this.authenticate();
    }
  }

  /**
   * Requests and a JSON object containing information about a specified gfyname.
   * @async
   * @method
   * @param {string} gfyname - The name of the gfycat (e.g. "admirabledaringbluewhale"). Can be found in the URL of the gfycat you want information about.
   * @return {object} A object containing information about the gfycat.
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
   * Generates an "empty" gfyname (i.e. there will not be any media at that URL).
   * @async
   * @method
   * @return {string} A randomly-generated gfyname.
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
   * Uploads and creates a new gfycat from a provided URL.
   * @async
   * @method
   * @param {string} URL - The direct URL of the media you want to upload to Gfycat.
   * @param {string} [title=""] - (Optional) The title you want the gfycat to have.
   * @param {string} [desc=""] - (Optional) The description for the gfycat.
   * @param {Array<string>} [tags=[]] - (Optional) Tags to add to the gfycat.
   * @return {object} An object containing information about the upload.
   */
  async uploadFromURL(URL, title = "", desc = "", tags = []) {
    await this.checkToken();

    const res = await axios({
      method: "POST",
      url: "https://api.gfycat.com/v1/gfycats/",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: {
        fetchUrl: URL,
        title: title,
        desc: desc,
        tags: tags,
        noMd5: "true", // Allow duplicate media to be uploaded to Gfycat without being rejected.
      },
    });

    return res.data;
  }

  /**
   * Uploads a local file to the Gfycat service.
   * @async
   * @method
   * @param {string} filepath - The filepath to the file you want to upload.
   * @return {object} An object containing information about the upload.
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
   * Requests and returns information about the status of a specified gfycat. Mainly used to check whether a gfycat has finished encoding after being uploaded.
   * @param {string} gfyname - The name of the gfycat (e.g. "admirabledaringbluewhale"). Can be found in the URL of the gfycat you want information about.
   * @return {object} An object containing information about the upload.
   */
  async checkUploadStatus(gfyname) {
    this.checkToken();

    const endpoint =
      "https://api.gfycat.com/v1/gfycats/fetch/status/" + gfyname;

    const headers = {
      Authorization: `Bearer ${this.token}`,
    };

    const res = await axios.get(endpoint, headers);
    return res.data;
  }
}

module.exports = GfycatClient;

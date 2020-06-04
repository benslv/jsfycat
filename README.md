# jsfycat
A Node.js wrapper for the [Gfycat API](https://developers.gfycat.com/) using `async/await` functionality.

## Installation
**NPM**  
```
npm install jsfycat
```

**Yarn**  
```
yarn add jsfycat
```

## Usage
First, obtain a client ID and client secret from the [Gfycat Developer Portal](https://developers.gfycat.com/signup/#/apiform).

**Store these client credentials in a secure location.**

```js
const GfycatClient = require("jsfycat");

async function main() {
	const gfycat = new GfycatClient({
		clientId: "clientId goes here",
		clientSecret: "client secret goes here.",
	});
}

main();
```

## Methods
### Authenticate
Returns an API access token, valid for 1 hour.

```js
await gfycat.authenticate();
```

### Get Gfycat Information
Returns a JSON containing information about a specified gfycat.

```js
gfyInfo = await gfycat.getGfycatInfo("Gfyname goes here.");
```

### Upload from URL
Uploads a remote file to Gfycat by specifying its URL.

```js
urlUploadRes = await gfycat.uploadFromUrl("URL goes here.");
```

### Upload from file
Uploads a local file to Gfycat.

```js
fileUploadRes = await gfycat.uploadFromFile("Filepath goes here.");
```
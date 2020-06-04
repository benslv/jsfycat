const GfycatClient = require("./src/jsfycat");

async function main() {
	const gfycat = new GfycatClient({
		clientId: "clientId goes here",
		clientSecret: "client secret goes here.",
	});

	// Start by authenticating the service for the first time.
	await gfycat.authenticate();

	// Retrieve some information about a specified gfy.
	gfyInfo = await gfycat.getGfycatInfo("admirabledaringbluewhale");

	// Upload a file to Gfycat via a URL.
	urlUploadRes = await gfycat.uploadFromUrl(
		"https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
	);

	// Upload a local file to Gfycat.
	fileUploadRes = await gfycat.uploadFromFile("llama.gif");
}

main();

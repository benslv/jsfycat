const GfycatClient = require("./src/jsfycat");

async function main() {
	const gfycat = new GfycatClient({
		clientId: "2_cBXWlY",
		clientSecret: "nKn8iYqlRKU5qbl3NxLflHiXV3eFx23IsjpBEHMpZmW7s8aN4oP81vbABFFFEI7J",
	});

	await gfycat.authenticate();
	console.log("Token", gfycat.token);

	// gfyInfo = await gfycat.getGfycatInfo("bruisedcaringjumpingbean");
	// console.log(gfyInfo);

	// urlUploadRes = await gfycat.uploadFromUrl(
	// 	"https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
	// );

	// console.log("urlUploadRes", urlUploadRes);

	// console.log("urlUploadStatus", await gfycat.checkUploadStatus(urlUploadRes.gfyname));

	fileUploadRes = await gfycat.uploadFromFile("test.mp4");

	console.log("FileUploadRes", fileUploadRes);

	console.log("fileUploadStatus", await gfycat.checkUploadStatus(fileUploadRes));
}

main();

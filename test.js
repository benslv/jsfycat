const Gfycat = require("./src/jsfycat");

const gfycat = new Gfycat({
	clientId: "2_cBXWlY",
	clientSecret: "nKn8iYqlRKU5qbl3NxLflHiXV3eFx23IsjpBEHMpZmW7s8aN4oP81vbABFFFEI7J",
});

// gfycat.getGfycatInfo("repentantequalbillygoat");

console.log("Uploading url to Gfycat...");
gfycat.uploadFromUrl(
	"https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
);

// console.log("Fetching empty gfyname...\n");
// console.log(gfycat.getEmptyGfyname());

const GfycatClient = require("./src/jsfycat");

const main = async () => {
  const gfycat = new GfycatClient({
    clientId: "2_q3aX5S",
    clientSecret:
      "cdeea1aoUSRhGSUeiU278SQ7KBk_WRbU8WAac5l2hVCbQBaL-FiOnflx3G9prnn4",
  });

  const name = await gfycat.getEmptyGfyname();
  console.log(name);

  const urlUpload = await gfycat.uploadFromURL(
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "hello, world!",
  );
  console.log(urlUpload);

  const intervalCheck = setInterval(async () => {
    const { task, gfyname } = await gfycat.checkUploadStatus(urlUpload.gfyname);
    if (task === "complete") {
      console.log(
        `Gfycat successfully created at http://gfycat.com/${gfyname}`,
      );
      clearInterval(intervalCheck);
    } else {
      console.log("Not yet uploaded.");
    }
  }, 2000);
};

main()
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

import mongoose from "mongoose";

const url = "http://localhost:8000";

let gridfsBucket;
const conn = mongoose.connection;

/* ================= GRIDFS INIT ================= */
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos", // same bucket everywhere
  });
  console.log("✅ GridFS Ready");
});

/* ================= UPLOAD IMAGE / FILE ================= */
export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }

    const filename = `${Date.now()}-${req.file.originalname}`;

    const uploadStream = gridfsBucket.openUploadStream(filename);
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      const fileUrl = `${url}/file/${filename}`;
      res.status(200).json(fileUrl); // 👈 frontend expects URL string
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/* ================= GET IMAGE / FILE ================= */
export const getImage = async (req, res) => {
  try {
    const files = await gridfsBucket
      .find({ filename: req.params.filename })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json("File not found");
    }

    gridfsBucket
      .openDownloadStreamByName(req.params.filename)
      .pipe(res);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

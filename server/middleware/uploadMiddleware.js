import multer from "multer";

// Use memory storage — files are held as buffers in RAM and uploaded
// directly to Cloudinary without ever touching the disk.
// This is critical for cloud deployments (e.g. Render) whose filesystems
// are ephemeral and wiped on every restart or redeploy.
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const allowedMimes = /^image\/(jpeg|jpg|png|webp|gif)$/;
  if (allowedMimes.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error("Images only (jpg, jpeg, png, webp, gif)!"));
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max per file
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;

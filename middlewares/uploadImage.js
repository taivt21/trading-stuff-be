import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import { Storage } from "@google-cloud/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Khởi tạo Storage của Firebase
const storage = new Storage({
  projectId: "noti-1620",
  keyFilename: path.join(__dirname, "../config/google-services.json"),
});

// Lấy reference đến bucket trong Firebase Storage
const bucket = storage.bucket("auth-fhome.appspot.com");

// Khởi tạo middleware upload ảnh với Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 }, // giới hạn kích thước file là 5MB
  fileFilter: (req, file, cb) => {
    // Kiểm tra định dạng file
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type.");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    return cb(null, true);
  },
}).single("img");

// Middleware upload ảnh
export const uploadImage = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      // Nếu xảy ra lỗi trong quá trình upload, trả về lỗi 400
      return res.status(400).json({
        status: "Fail",
        message: err.message,
      });
    }

    if (!req.file) {
      // Nếu không có file nào được chọn, trả về lỗi 400
      return next();
    }

    try {
      // Tạo đường dẫn trong Firebase Storage
      const filePath = `post/${uuidv4()}${path.extname(req.file.originalname)}`;
      const fileUpload = bucket.file(filePath);

      // Khởi tạo stream để upload file lên Firebase Storage
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Xử lý lỗi trong quá trình upload
      blobStream.on("error", (error) => {
        console.log(error);
        return res.status(400).json({
          status: "Fail",
          message: error.message,
        });
      });

      // Khi upload hoàn tất, gán đường dẫn vào trường img trong body của request
      blobStream.on("finish", async () => {
        // req.body.img = `gs://${serviceAccount.project_id}/${filePath}`;
        const file = bucket.file(filePath);
        // Tạo một URL đã ký với thời gian hết hạn là 30 ngày
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        const publicUrl = await file.getSignedUrl({
          action: "read",
          expires: expires,
        });
        req.body.img = publicUrl[0];
        next();
      });

      // Ghi dữ liệu vào stream và kết thúc stream
      blobStream.end(req.file.buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "Fail",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};

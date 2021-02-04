const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// S3 configuration
const s3Config = new aws.S3({
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    region: "ap-northeast-1",
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true); // true = store image
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

// This is just to test locally if multer is working fine.
// const storage = multer.diskStorage({
//     destination: (req, res, cb) => {
//         cb(null, 'src/api/media/profiles')
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname)
//     }
// })

// Create multer-s3 function for storage
const multerS3Config = multerS3({
    s3: s3Config,
    bucket: "wishman-item-images",
    // metadata for putting field name
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    // Set/Modify original file name
    key: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname);
    },
    // without defining contentType like below, the image gets downloaded instead of displaying when you access url
    contentType: multerS3.AUTO_CONTENT_TYPE,
});

// Create multer function for upload
const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})

module.exports = upload;
  
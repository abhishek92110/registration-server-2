const util = require("util");
const multer = require("multer");
const maxSize = 50 * 1024 * 1024;
// const directoryPath = __basedir + "/resources/static/assets/uploads/";
console.log('upload file')
let storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
  
    cb(null,  __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log("file name from upload=",file,file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;

 
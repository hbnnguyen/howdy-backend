"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = __importDefault(require("multer"));
exports.multerConfig = {
    storage: multer_1.default.diskStorage({
        destination: '/tmp/',
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
            return cb(null, false);
        }
        cb(null, true);
    }
};
//TODO: REFACTOR
// MemoryStorage
// The memory storage engine stores the files in memory as Buffer objects. It doesn’t have any options.
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

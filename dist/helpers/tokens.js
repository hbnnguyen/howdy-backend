"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
/** return signed JWT {id} from user data. */
function createToken(user) {
    const payload = {
        id: user.id
    };
    return jsonwebtoken_1.default.sign(payload, config_1.default.SECRET_KEY);
}
exports.createToken = createToken;

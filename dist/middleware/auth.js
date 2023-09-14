"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCorrectUser = exports.ensureLoggedIn = exports.authenticateJWT = void 0;
/** Convenience middleware to handle common auth cases in routes. */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const expressError_1 = require("../expressError");
/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the id field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (authHeader) {
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        try {
            res.locals.user = jsonwebtoken_1.default.verify(token, config_1.default.SECRET_KEY);
        }
        catch (err) {
            /* ignore invalid tokens (but don't store user!) */
        }
    }
    return next();
}
exports.authenticateJWT = authenticateJWT;
/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(req, res, next) {
    if (res.locals.user?.id)
        return next();
    return next(new expressError_1.UnauthorizedError());
}
exports.ensureLoggedIn = ensureLoggedIn;
/** Middleware to use when they must provide a valid token & be user matching
 *  id provided as route param.
 *
 *  If not, raises Unauthorized.
 */
function ensureCorrectUser(req, res, next) {
    const id = res.locals.user?.id;
    if (id && (id === +req.params.id)) {
        return next();
    }
    return next(new expressError_1.UnauthorizedError());
}
exports.ensureCorrectUser = ensureCorrectUser;

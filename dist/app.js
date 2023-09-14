"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.prisma = void 0;
// import 'express-async-errors'
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const cors_1 = __importDefault(require("cors"));
// import { userRoutes } from "./routes/v1/users.route";
// import { authRoutes } from "./routes/v1/auth.route";
// import { friendRoutes } from "./routes/v1/friends.route";
// import { likeDislikeRoutes } from "./routes/v1/likedislike.route";
// import { messageRoutes } from "./routes/v1/messages.route";
// import { chatRoutes } from "./routes/v1/chats.route";
const routes_1 = __importDefault(require("./routes"));
const expressError_1 = require("./expressError");
const client_1 = require("@prisma/client");
const auth_1 = require("./middleware/auth");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Enable all cors requests for all routes
app.use(express_1.default.json());
app.use(auth_1.authenticateJWT);
app.use('/', routes_1.default);
app.use((req, res, next) => {
    res.status(404).send();
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).send();
});
app.use(express_1.default.urlencoded({ limit: '50000mb', extended: false }));
// user route for all path
// app.use("/users", userRoutes);
// app.use("/auth", authRoutes);
// app.use("/likeDislike", likeDislikeRoutes);
// app.use("/friends", friendRoutes);
// app.use("/chats", chatRoutes);
// app.use("/messages", messageRoutes);
app.get("*", (req, res, next) => {
    return next(new expressError_1.NotFoundError());
});
//FIXME: fix error handling ???
/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    console.log("shagua");
    if (process.env.NODE_ENV !== "test")
        console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        error: { message, status },
    });
});
exports.handler = (0, serverless_http_1.default)(app);

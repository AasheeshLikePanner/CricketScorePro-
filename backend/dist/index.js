"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./db/index");
const app_1 = __importDefault(require("./app"));
console.log("Starting the server...");
(0, index_1.connectDB)()
    .then(() => {
    const port = process.env.PORT || 8000;
    app_1.default.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection failed!!!", err);
    process.exit(1); // Exit the process with a failure code
});

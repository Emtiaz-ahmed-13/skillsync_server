"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
async function main() {
    await (0, database_1.default)();
    const server = app_1.default.listen(config_1.default.port, () => {
        console.log("Server is running on port ", config_1.default.port);
    });
}
main();

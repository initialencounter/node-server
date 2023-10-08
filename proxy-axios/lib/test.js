"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
(0, axios_1.default)({
    url: "http://127.0.0.1:7860",
    method: "POST",
    data: {
        payload: {
            url: "https://github.com/initialencounter",
            method: 'get'
        }
    }
}).then(e => {
    console.log(e.data);
});

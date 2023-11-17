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
// import axios from "axios";
// import { writeFileSync} from "fs";
// const currentTime = new Date().toUTCString();
// console.log(currentTime)
// axios({
//     url: "https://github.com/initialencounter",
//     method: 'get',
//     headers: {
//         "Cookie": "logged_in=yes;\
//         tz=Asia%2FShanghai",
//     },
// }).then(e => {
//     writeFileSync('html.html', e.data)
//     getMatch(e.data, "2023-11-18")
// });
// function getMatch(s, date) {
//     const start = s.indexOf(`data-date="${date}"`);
//     let tmpString = s.slice(start);
//     const tiler = " on " + formatDate(date);
//     const end = tmpString.indexOf(tiler);
//     tmpString = tmpString.slice(0, end);
//     const start2 = tmpString.lastIndexOf('>');
//     const end2 = tmpString.lastIndexOf(' contribution');
//     const tile = tmpString.slice(start2 + 1, end2);
//     console.log("111", tile)
//     return tile;
// }
// function formatDate(inputDate) {
//     // 将输入日期字符串分割成月份和日期
//     const [_, month, day] = inputDate.split('-');
//     // 将月份数字转换为对应的月份名
//     const months = [
//         'January', 'February', 'March', 'April',
//         'May', 'June', 'July', 'August',
//         'September', 'October', 'November', 'December'
//     ];
//     const monthName = months[parseInt(month, 10) - 1];
//     // 返回格式化后的日期字符串
//     return `${monthName} ${parseInt(day, 10)}`;
// }

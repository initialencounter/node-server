// import axios from "axios";
// axios({
//     url:"http://127.0.0.1:7860",
//     method: "POST",
//     data:{
//         payload:{
//             url: "https://github.com/initialencounter",
//             method: 'get'
//         }
//     }
// }).then(e=>{
//     console.log(e.data)
// })

import axios from "axios";
import { writeFileSync, readFileSync } from "fs";

const currentTime = new Date().toUTCString();
console.log(currentTime)
axios({
    url: "https://github.com/initialencounter",
    method: 'get',
    headers: {
        Date: "Tur, 16 Nov 2023 23:29:16 GMT",
        'Content-Type': 'application/json',
        'X-Custom-Time': currentTime, // 自定义头部字段，这里命名为 X-Custom-Time
    },
}).then(e=>{
    writeFileSync('html.html',e.data)
})


const s = readFileSync('html.html', { encoding: "utf-8" })
getMatch(s, "2023-11-17")
function getMatch(s, date) {
    const start = s.indexOf(`data-date="${date}"`);
    let tmpString = s.slice(start);
    const tiler = " on " + formatDate(date);
    const end = tmpString.indexOf(tiler);
    tmpString = tmpString.slice(0, end);
    const start2 = tmpString.lastIndexOf('>');
    const end2 = tmpString.lastIndexOf(' contribution');
    const tile = tmpString.slice(start2 + 1, end2);
    console.log(tile)
    return tile;
}
function formatDate(inputDate) {
    // 将输入日期字符串分割成月份和日期
    const [_, month, day] = inputDate.split('-');
    // 将月份数字转换为对应的月份名
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    const monthName = months[parseInt(month, 10) - 1];
    // 返回格式化后的日期字符串
    return `${monthName} ${parseInt(day, 10)}`;
}
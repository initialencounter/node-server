import axios from "axios";

axios({
    url:"http://127.0.0.1:7860",
    method: "POST",
    data:{
        payload:{
            url: "https://github.com/initialencounter",
            method: 'get'
        }
    }
}).then(e=>{
    console.log(e.data)
})

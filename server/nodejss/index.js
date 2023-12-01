// const http= require("http");
import http from "http";

import { lovercounter } from "./loveCounter.js"

import fs from "fs"

// const readed=fs.readFileSync("./readingFile.html")
// const readed=fs.readFile("./readingFile.html")
// console.log(readed)








const server = http.createServer((res, req) => {
    console.log(res.url);
    if (res.url === "/") {
        // res.method()
        req.end("home");
    }
    else if (res.url === "/about") {
        req.end(`your love is ${lovercounter()}`);
    }
    else if (res.url === "/read") {
        fs.readFile("./readingFile.html", (err, data) => {        
            req.end(data)
        })
        // req.end(readed);
    }
    else {
        req.end("page not found");
    }
});

server.listen(3000, () => {
    console.log("server is workingsdfgds");
})
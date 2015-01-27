var koa = require("koa");
var app = koa();

app.listen(process.env.PORT, process.env.IP);
console.log("Server is rinning on port: " + process.env.PORT);
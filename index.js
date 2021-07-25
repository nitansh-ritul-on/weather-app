const log = console.log;
const fs = require("fs");
const http = require("http");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, originalVal) => {
  let temperature = tempVal.replace("{%temp%}", originalVal.main.temp);
  temperature = temperature.replace("{%tempMin%}", originalVal.main.temp_min);
  temperature = temperature.replace("{%tempMax%}", originalVal.main.temp_max);
  temperature = temperature.replace("{%location%}", originalVal.name);
  temperature = temperature.replace("{%country%}", originalVal.sys.country);
  temperature = temperature.replace("{%tempStatus%}", originalVal.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=843d3571a3ae259ffa379d8db64a6437"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return log("connection closed due to error", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});
server.listen(8000,'127.0.0.1');

const mysql = require("mysql");
const mqtt = require("mqtt");
const fs = require("fs");

const log = console.log;
const dbconn = jp(gf("db.json"));
const query = gf("sql/website.sql");
const result = [];

const connection = mysql.createConnection(dbconn);
connection.connect();
connection.query(query, (err, rows, fields) => {
  rows.forEach((row) => {
    result.push(row.eng_id);
  });
  mqttExec(0, 10);
  fs.writeFileSync("result/homepage", result.join(",\r\n"), "utf-8");
});
connection.end();

function mqttExec(start, end) {
  const client = mqtt.connect("mqtt:dev.mnemosyne.co.kr");
  const clubs = result.slice(start, end);
  log(clubs);
  client.on("connect", () => {
    log("connected!!");
    const param = {
      club: "",
      club_id: "",
      clubs,
      command: "searchAll", // reserveSearchAll, searchAll
    };
    client.publish(
      // "f4972159-1620-11ed-a93e-0242ac11000a", //기기마다 다름
      "d1e00388-17aa-11ed-a93e-0242ac11000a", //기기마다 다름
      JSON.stringify(param),
      {
        retain: true,
        qos: 0,
      }
    );
    client.end();
  });
  client.on("error", (err) => {
    log(err);
  });
}
function gf(file) {
  //get file
  return fs.readFileSync(file, "utf-8");
}
function jp(str) {
  return JSON.parse(str);
}

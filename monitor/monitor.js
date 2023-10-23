const mysql = require("mysql");
const fs = require("fs");
const request = require("request");
const log = console.log;
const dir = console.dir;

const golf_club_eng_name = "goldlake";
const golf_club_id = "55b1a0bd-efbc-11ec-a93e-0242ac11000a";

const localMode = true;
const addr = localMode
  ? "http://localhost:8080/"
  : "https://monitor.mnemosyne.co.kr/monitor/1/";

String.prototype.query = function (param) {
  if (!param) param = {};
  const query = gf("sql/" + this.toString() + ".sql").dp(param);
  const dbconn = jp(gf("db.json"));
  const connection = mysql.createConnection(dbconn);
  connection.connect();
  return new Promise((res, rej) => {
    connection.query(query, (err, rows, fields) => {
      res(rows);
      connection.end();
    });
  });
};
String.prototype.api = function (param) {
  const self = this;
  return new Promise((res, rej) => {
    request.post(addr + self.toString(), { json: param }, (err, resp, body) => {
      res(body);
    });
  });
};
String.prototype.dp = function (param) {
  let self = this;
  const keys = Object.keys(param);
  keys.forEach((key) => {
    const regex = new RegExp("\\$\\{".add(key).add("\\}"), "g");
    const val = param[key];
    self = self.replace(regex, val);
  });
  return self;
};
String.prototype.add = function add(str) {
  return [this, str].join("");
};
String.prototype.write = function (con) {
  fs.writeFileSync(this.toString(), con);
};
String.prototype.append = function (con) {
  fs.appendFileSync(this.toString(), con);
};
const logfile = "result/monitor/result.log";
let proc = "normal";

main();
async function main() {
  logfile.write("");
  // const list = await "getProcLoginByProc".query({ proc });
  // const list = await "getSafeClubList".query({ proc });
  /* const list = jp(gf("result/monitor/error.log"))[
    "search script injection error"
  ];
  list.forEach((club) => {
    club.proc = "redirect";
  }); */
  /* const list = await "getClubListNoProc".query({ proc });
  list.forEach((club) => {
    club.result = "y";
    club.proc = "normal";
  }); */
  //const list = await "getClubResultYButNull".query({ proc });
  const list = [
    {
      id: "e46722c6-f07a-11ec-a93e-0242ac11000a",
      eng_id: "oak_creek",
      proc: "normal",
    },
  ];

  /* const list = await "getClubPass".query({ proc }); */
  /* const list = await "getNotTested".query({ proc }); */

  await loginSearch(list);

  /* const club = list[0];
  const param = { clubId: club.id, proc: club.proc };
  const body = await "forcdn".api(param);
  log(body); */
}
async function loginSearch(list) {
  const club = list.shift();
  log(club);
  if (!club) {
    log("the end of work!!");
    return;
  }

  logfile.append(club.id + "::" + club.eng_id);
  logfile.append("\r\n");
  const param = { clubId: club.id, proc: club.proc };
  const body = await "datesearch".api(param);

  logfile.append(JSON.stringify(body));
  logfile.append("\r\n\r\n");
  await loginSearch(list);
}
function gf(file) {
  //get file
  return fs.readFileSync(file, "utf-8");
}
function jp(str) {
  return JSON.parse(str);
}

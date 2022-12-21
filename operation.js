const mysql = require("mysql");
const mqtt = require("mqtt");
const fs = require("fs");
const log = console.log;

addGolfClubEng();

function addGolfClubEng() {
  const con = gf("test.doc");
  const queries = [];
  con.split("\n").forEach((ln) => {
    const [name, , eng, , , , , , description] = ln.split("\t");
    const query = "select * from golf_club where name='" + name + "';";
    queries.push([query, eng]);
  });

  exec();
  let cnt = 0;
  function exec() {
    const el = queries.shift();
    if (!el) return;
    const [query, eng] = el;
    setQuery(query, (res) => {
      const [row] = res;
      log(cnt++, row.name, row.id, eng);
      const qry =
        "insert into golf_club_eng values('" + eng + "', '" + row.id + "');";
      setQuery(qry, (res) => {
        log(res);
        exec();
      });
    });
  }
}
function addGolfClub() {
  const con = gf("test.doc");
  const engs = [];
  const queries = [];
  con.split("\n").forEach((ln) => {
    const [
      name,
      address,
      eng,
      area,
      phone,
      email,
      homepage,
      regNum,
      description,
    ] = ln.split("\t");
    engs.push(eng);
    const query =
      "insert into golf_club values(uuid(), '" +
      name +
      "', '" +
      address +
      "', '" +
      area +
      "','" +
      phone +
      "','" +
      email +
      "','" +
      homepage +
      "', '" +
      regNum +
      "', '" +
      description.replace(/<br>/g, "\n").replace(/\s+$/, "").replace(/'/g, "") +
      "', now(), now());";
    queries.push(query);
  });
  function exec() {
    const query = queries.shift();
    if (!query) return;
    setQuery(query, (res) => {
      log(res);
      exec();
    });
  }
}
function setQuery(query, func) {
  const dbconn = jp(gf("db.json"));
  const result = [];

  const connection = mysql.createConnection(dbconn);
  connection.connect();
  connection.query(query, (err, rows, fields) => {
    if (err) {
      func(err);
      return;
    }
    func(rows);
  });
  connection.end();
}
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

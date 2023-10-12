const fs = require("fs");
const log = console.log;

const con = fs.readFileSync("result/monitor/result.log", "utf-8");
let eng_id;
const res = [];
const error = {};
con.split("\r\n").forEach((ln) => {
  if (ln == "") return;
  if (ln.indexOf("::") == 36) {
    eng_id = ln.split("::")[1];
  } else {
    const { club_id, proc, jsonstr, message, redirectChain } = JSON.parse(ln);
    if (message) {
      error[message] ??= [];
      error[message].push({ id: club_id, eng_id, proc });
    } else if (redirectChain) {
    } else if (jsonstr) {
      res.push({ eng_id, proc, golfClubId: club_id });
    }
  }
});
fs.writeFileSync("result/monitor/error.log", JSON.stringify(error, null, 4));
/* log(res); */
log(res.length);

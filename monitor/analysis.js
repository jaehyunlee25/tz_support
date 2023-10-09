const fs = require("fs");
const log = console.log;

const con = fs.readFileSync("result/dateSearchResult.log", "utf-8");
let eng_id;
const res = [];
const error = {};
con.split("\r\n").forEach((ln) => {
  if (ln == "") return;
  if (ln.indexOf("::") == 36) {
    eng_id = ln.split("::")[1];
  } else {
    const { club_id, jsonstr, message, redirectChain } = JSON.parse(ln);
    if (message) {
      error[message] ??= [];
      error[message].push({ id: club_id, engId, proc: "redirect" });
    } else if (redirectChain) {
    } else if (jsonstr) {
      res.push({ eng_id, golfClubId: club_id });
    }
  }
});
log(error);
/* log(res);
log(res.length); */

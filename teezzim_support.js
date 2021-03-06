const mysql = require("mysql");
const fs = require("fs");
const request = require("request");
const { getgroups } = require("process");
const log = console.log;
const dir = console.dir;

const golf_club_eng_name = "andonglake";
getLoginScript();
// getSearchScript();
// getGolfClubInfo();
// getGolfClubInfoEx();
// getCoreScript();
/*
request.post(
  // "http://mnemosynesolutions.co.kr:8080/login",
  "http://localhost:8080/control",
  // { clubId: "053d7baf-ce10-11ec-a93e-0242ac11000a" },
  { json: { club: "tani" } },
  (err, resp, body) => {
    log(body);
  }
);
*/

function getSearchScript() {
  request.post(
    "http://mnemosynesolutions.co.kr:8080/search",
    { json: { club: golf_club_eng_name } },
    function (error, response, body) {
      fs.writeFileSync("searchResult.js", body.script);
    }
  );
}
function getCoreScript() {
  request.post(
    "http://mnemosynesolutions.co.kr:8080/get_pure_search_core",
    { json: { club: golf_club_eng_name } },
    function (error, response, body) {
      Object.keys(body.part).forEach((key) => {
        fs.writeFileSync("core/" + key + ".js", body.part[key].join("\n"));
      });
    }
  );
}
function getGolfClubInfoEx() {
  request.post(
    "http://mnemosynesolutions.co.kr:8080/searchbot",
    { json: { club: golf_club_eng_name } },
    function (error, response, body) {
      //console.log(body);
      fs.writeFileSync("clubResult", body.script);
    }
  );
}
function getGolfClubInfo() {
  const query = gf("golf_course.sql");
  const result = {};
  const dbconn = jp(gf("db.json"));
  const connection = mysql.createConnection(dbconn);
  connection.connect();
  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.log(err);
      return;
    }
    rows.forEach((row) => {
      if (!result[row.golf_club_english_name])
        result[row.golf_club_english_name] = [];
      result[row.golf_club_english_name].push(row);
    });
    const param = {
      golf_club_id: "",
      golf_course: [],
    };
    result[golf_club_eng_name].forEach((course, i) => {
      if (i === 0) param.golf_club_id = course.golf_club_id;
      param.golf_course.push(
        [
          "'" + course.golf_course_name + "'",
          ": '",
          course.golf_course_id,
          "',",
        ].join("")
      );
    });
    param.golf_course = param.golf_course.join("\r\n\t");
    const script = gf("search_template.js").dp(param);
    const common = gf("search_template2.js").add(gf("search_template3.js"));
    request.post(
      "http://localhost:8080/search_core",
      { json: { club: golf_club_eng_name } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const core = body.script;
          let wrapper;
          try {
            wrapper = fs.readFileSync(
              "search_wrapper/" + golf_club_eng_name + ".js",
              "utf-8"
            );
          } catch (e) {
            console.log(e.toString());
          }
          console.log(wrapper);
          let result;
          if (wrapper)
            result = wrapper.dp({ searchScript: script + common + core });
          else result = script + common + core;
          fs.writeFileSync("clubResult", result);
        }
      }
    );
  });
  connection.end();
}
function getLoginScript() {
  const query = gf("login.sql");
  const result = {};
  const dbconn = jp(gf("db.json"));
  const connection = mysql.createConnection(dbconn);
  connection.connect();
  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.log(err);
      return;
    }
    rows.forEach((row) => {
      result[row.golf_club_english_name] = row;
    });

    request.post(
      "http://mnemosynesolutions.co.kr:8080/" + golf_club_eng_name,
      { json: { key: "value" } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const param = {
            login_id: result[golf_club_eng_name].golf_club_login_url_admin_id,
            login_password:
              result[golf_club_eng_name].golf_club_login_url_admin_pw,
          };
          fs.writeFileSync("loginResult", body.script.dp(param));
        }
      }
    );
    // console.log(result);
  });
  connection.end();
}

function gf(file) {
  //get file
  return fs.readFileSync(file, "utf-8");
}
function jp(str) {
  return JSON.parse(str);
}
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

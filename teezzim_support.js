const mysql = require("mysql");
const fs = require("fs");
const request = require("request");
const { getgroups } = require("process");
const log = console.log;
const dir = console.dir;

const golf_club_eng_name = "ladena";
/* request.post(
    "http://dev.mnemosyne.co.kr:1009/delDeviceRecord",
  { json: { deviceId: '9283dbbd-2a61-11ed-a93e-0242ac11000a' } },
  function (error, response, body) {
    log(body);
  }
); */
//getDoneClubs();
//getLoginScript();
getSearchScript();
//getReserveScript();
//getReserveSearchScript();
//getReserveCancelScript();

// getGolfClubInfo();
// getGolfClubInfoEx();
// getCoreScript();

/*
request.post(
  "https://dev.mnemosyne.co.kr/api/webview/getGolfClubList",
  //"http://dev.mnemosyne.co.kr:1006/api/reservation/getGolfClubs",
  // "http://localhost:8080/control",
  // { clubId: "053d7baf-ce10-11ec-a93e-0242ac11000a" },
  {
    json: {
      // club_id: "48681b19-f05f-11ec-a93e-0242ac11000b"
    },
  },
  (err, resp, body) => {
    log(body);
  }
);
*/

function getDoneClubs() {
  const query = gf("sql/done_clubs.sql");
  const result = {};
  const dbconn = jp(gf("db.json"));
  const connection = mysql.createConnection(dbconn);
  connection.connect();
  connection.query(query, (err, rows, fields) => {
    log(rows);
  });
  connection.end();
}
function getReserveCancelScript() {
  request.post(
    "http://dev.mnemosyne.co.kr:1009/reserveCancelbot_admin",
    {
      json: {
        club: golf_club_eng_name,
        year: "2022",
        month: "08",
        date: "26",
        course: "Challenge",
        time: "0637",
      },
    },
    function (error, response, body) {
      fs.writeFileSync("result/reserveCancelResult.js", body.script);
    }
  );
}
function getReserveSearchScript() {
  request.post(
    "http://dev.mnemosyne.co.kr:1009/reserveSearchbot_admin",
    {
      json: {
        club: golf_club_eng_name,
      },
    },
    function (error, response, body) {
      log(body.url);
      fs.writeFileSync("result/reserveSearchResult.js", body.script);
    }
  );
}
function getReserveScript() {
  request.post(
    "http://dev.mnemosyne.co.kr:1009/reservebot_admin",
    {
      json: {
        club: golf_club_eng_name,
        year: "2022",
        month: "08",
        date: "26",
        course: "Challenge",
        time: "0637",
      },
    },
    function (error, response, body) {
      fs.writeFileSync("result/reserveResult.js", body.script);
    }
  );
}
function getSearchScript() {
  const flg = false;
  log(flg);
  request.post(
    //,
    flg
      ? "https://dev.mnemosyne.co.kr/api/crawler/searchbot"
      : "https://dev.mnemosyne.co.kr/api/crawler/searchbots_date_admin",
    {
      json: {
        club: golf_club_eng_name,
        clubs: [golf_club_eng_name],
        date: "20220103",
      },
    },
    function (error, response, body) {
      log(body.urls);
      flg
        ? fs.writeFileSync("result/searchResult.js", body.script)
        : fs.writeFileSync(
            "result/searchResult.js",
            body.scripts[golf_club_eng_name]
          );
    }
  );
}
function getCoreScript() {
  request.post(
    "http://dev.mnemosyne.co.kr:1009/get_pure_search_core",
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
    "http://dev.mnemosyne.co.kr:1009/searchbot",
    { json: { club: golf_club_eng_name } },
    function (error, response, body) {
      //console.log(body);
      fs.writeFileSync("result/clubResult", body.script);
    }
  );
}
function getGolfClubInfo() {
  const query = gf("sql/golf_course.sql");
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
  const query = gf("sql/login.sql");
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
    log(result[golf_club_eng_name]);
    request.post(
      "http://dev.mnemosyne.co.kr:1009/" + golf_club_eng_name,
      { json: { key: "value" } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          log(golf_club_eng_name);
          const param = {
            login_id: result[golf_club_eng_name].golf_club_login_url_admin_id,
            login_password:
              result[golf_club_eng_name].golf_club_login_url_admin_pw,
          };
          fs.writeFileSync("result/loginResult", body.script.dp(param));
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

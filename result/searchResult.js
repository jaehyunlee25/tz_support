javascript: (() => {
  let log = console.log;
if (
  window.webkit &&
  window.webkit.messageHandlers &&
  window.webkit.messageHandlers.iosController
) {
  log = function (message) {
    window.webkit.messageHandlers.iosController.postMessage(message);
  };
}
const dir = console.dir;
const doc = document;
const ls = localStorage;
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const LOGID = new Date().getTime();
const logParam = {
  type: "command",
  sub_type: "",
  device_id: "${deviceId}",
  device_token: "${deviceToken}",
  golf_club_id: "${golfClubId}",
  fragment_id: "${fragment_id}",
  message: "",
  parameter: { LOGID },
};
const INTV_TIME = 1000;
const INTV_COUNT = 20;
let intvEl = doc.body;
let ac = false;
try {
  ac = window.AndroidController || window.webkit.messageHandlers.iosController;
  ac.message =
    ac.message || window.webkit.messageHandlers.iosController.postMessage;
} catch (e) {
  ac = false;
}

const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
const aDDr = location.href.split(splitter)[0];
const suffix = location.href.split(splitter)[1];
const dictSplitter = { "#": "?", "?": "#" };
let addr = aDDr;
if (aDDr.indexOf(dictSplitter[splitter]) != -1)
  addr = aDDr.split(dictSplitter[splitter])[0];

/* EXTZLOG("url", "rawAddr:" + location.href);
EXTZLOG("url", "aDDr:" + aDDr);
EXTZLOG("url", "addr:" + addr); */

function LSCHK(str, sec) {
  const tag = lsg(str);
  if (tag && new Date().getTime() - tag < 1000 * sec) return false;
  lss(str, new Date().getTime());
  return true;
}
function TZLOG(param, callback) {
  const addr = OUTER_ADDR_HEADER + "/api/reservation/newLog";
  post(addr, param, { "Content-Type": "application/json" }, (data) => {
    if (callback) callback(data);
  });
}
function EXTZLOG(subtype, message, param) {
  logParam.sub_type = subtype;
  logParam.message = "script log: " + message;
  logParam.timestamp = new Date().getTime();
  if (param) logParam.parameter = param;

  log(JSON.stringify(logParam));
}
function post(addr, param, header, callback) {
  var a = new ajaxcallforgeneral(),
    str = [];
  if (header["Content-Type"] == "application/json") {
    str = JSON.stringify(param);
  } else {
    for (var el in param) str.push(el + "=" + encodeURIComponent(param[el]));
    str = str.join("&");
  }
  a.post(addr, str, header);
  a.ajaxcallback = callback;
}
function get(addr, param, header, callback) {
  var a = new ajaxcallforgeneral(),
    str = [];
  for (var el in param) {
    str.push(el + "=" + param[el]);
  }
  str = str.join("&");
  a.jAjax(addr + "?" + str, header);
  a.ajaxcallback = callback;
}
function ajaxcallforgeneral() {
  this.xmlHttp;
  var j = this;
  var HTTP = {};
  var ADDR;
  var PARAM;
  var HEADER;
  const rs = [
    "요청이 초기화되지 않은 상태",
    "서버 연결이 이루어지지 않음",
    "요청이 수신된 상태",
    "요청을 처리중인 상태",
    "요청의 처리가 종료되고, 응답이 준비된 상태",
  ];
  this.jAjax = function (address, header) {
    /* const cp = JSON.parse(JSON.stringify(logParam));
    cp.parameter = { LOGID };
    log(JSON.stringify(cp)); */

    j.address = address;
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.onerror = onError;
    j.xmlHttp.open("GET", address, true);
    if (header) {
      Object.keys(header).forEach((key) => {
        var val = header[key];
        j.xmlHttp.setRequestHeader(key, val);
      });
    }
    j.xmlHttp.send(null);
  };
  this.post = function (addr, prm, header) {
    /* const cp = JSON.parse(JSON.stringify(logParam));
    cp.parameter = { LOGID };
    log(JSON.stringify(cp)); */

    j.address = addr;
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.onerror = onError;
    j.xmlHttp.open("POST", addr, true);

    if (header) {
      if (header["Content-Type"])
        Object.keys(header).forEach((key) => {
          var val = header[key];
          j.xmlHttp.setRequestHeader(key, val);
        });
      else
        j.xmlHttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
    } else {
      j.xmlHttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    }

    ADDR = addr;
    PARAM = prm;
    HEADER = JSON.stringify(header);

    j.xmlHttp.send(prm);
  };
  this.file = function (addr, prm) {
    j.address = addr;
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.open("POST", addr, true);
    j.xmlHttp.send(prm);
  };
  function onError() {}
  function on_ReadyStateChange() {
    const rsnum = j.xmlHttp.readyState;
    EXTZLOG("ajax", "readyState" + rsnum + "," + rs[rsnum]);
    if (rsnum == 4) {
      if (j.xmlHttp.status == 200) {
        EXTZLOG("ajax", "status," + j.xmlHttp.status);
        var data = j.xmlHttp.responseText;
        try {
          EXTZLOG("ajax", "ajax_callback," + j.address);
          j.ajaxcallback(data);
        } catch (e) {
          EXTZLOG("ajax", "script_error_in_ajax_callback," + e.stack);
        }
      } else {
        EXTZLOG("ajax", "ajax status error," + j.xmlHttp.status);
      }
    }
  }
}
function SENDMQTT(subtype, addr, e, data) {
  const WS_HEADER = "wss://dev.mnemosyne.co.kr/wss";
  const socket = new WebSocket(WS_HEADER);
  logParam.sub_type = subtype;
  logParam.timestamp = new Date().getTime();
  logParam.message = [addr, e.stack];
  logParam.responseText = data;
  socket.onopen = function () {
    socket.send(
      JSON.stringify({
        topic: "TZLOG",
        command: "publish",
        message: JSON.stringify(logParam),
      })
    );
  };
}
function SENDAC(e, data) {
  if (ac) {
    const param = {
      command: "SCRIPT_ERROR_IN_AJAX_CALLBACK",
      LOGID,
      timestamp: new Date().getTime(),
    };
    const strPrm = JSON.stringify(param);
    ac.message(strPrm);
    lsc();
  }
}
function lsg(str) {
  return localStorage.getItem(str);
}
function lss(key, val) {
  return localStorage.setItem(key, val);
}
function lsr(str) {
  return localStorage.removeItem(str);
}
function lsc() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.indexOf("TZ_") == -1) return;
    lsr(key);
  });
}
String.prototype.gt = function (num) {
  return this.substring(this.length - num, this.length);
};
String.prototype.gh = function (num) {
  return this.substring(0, num);
};
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};
String.prototype.ch = function (num) {
  return this.substring(num, this.length);
};
String.prototype.addzero = function () {
  if (this.length == 1) return "0" + this;
  return this;
};
String.prototype.inparen = function (opt) {
  const regex = /.+?\((.+)\)/;
  const str = this.toString();
  const result = [];
  const org = regex.exec(str)[1];
  if (opt) {
    let ar = [];
    let flg = false;
    Array.from(org).forEach((chr) => {
      if (chr == "'") {
        flg = !flg;
      } else if (chr == ",") {
        if (flg) {
          ar.push(chr);
        } else {
          result.push(ar.join(""));
          ar = [];
        }
      } else {
        ar.push(chr);
      }
    });
    if (ar.length > 0) {
      result.push(ar.join(""));
      ar = [];
    }
  } else {
    org
      .split("'")
      .join("")
      .split(",")
      .forEach((str) => {
        result.push(str.trim());
      });
  }
  return result;
};
String.prototype.datify = function (sign) {
  const str = this.toString();
  if (!sign) sign = "-";
  return [str.gh(4), str.ch(4).gh(2), str.gt(2)].join(sign);
};
String.prototype.getFee = function () {
  let str = this.toString();
  str = str.replace(/[^0-9]/g, "");
  return str * 1;
};
String.prototype.daySign = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  let sign;
  if (num == 0) sign = 3;
  else if (num == 6) sign = 2;
  else sign = 1;
  return sign.toString();
};
String.prototype.dayNum = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  return (num + 1).toString();
};
String.prototype.dayKor = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  return week[num];
};
String.prototype.rm = function (str) {
  return this.split(str).join("");
};
String.prototype.fillzero = function (sep) {
  const ar = this.split(sep);
  const result = [];
  ar.forEach((el) => {
    result.push(el.addzero());
  });

  return result.join("");
};
String.prototype.jp = function () {
  return JSON.parse(this);
};
String.prototype.regex = function (re) {
  return re.exec(this);
};
String.prototype.gup = function () {
  /*get url param*/
  const param = {};
  this.split("?")[1]
    .split("&")
    .forEach((str) => {
      const [key, val] = str.split("=");
      param[key] = val;
    });
  return param;
};
String.prototype.sort = function () {
  return Array.from(this).sort().join("");
};
String.prototype.vector = function () {
  /* 정렬한 뒤, 겹치는 글자는 뺀다. */
  const res = {};
  Array.from(this)
    .sort()
    .forEach((chr) => (res[chr] = true));
  return Object.keys(res).join("");
};
String.prototype.getGet = function () {
  var url = this.toString(),
    u = url.split("?")[1],
    a = {};
  if (u) {
    var arr = u.split("&");
    arr.forEach((d, n) => {
      var t = d.split("=");
      a[t[0]] = t[1];
    });
  } else {
    return false;
  }
  return a;
};
String.prototype.comp = function (str) {
  let a = Array.from(this);
  let b = Array.from(str);
  let c;
  if (b.length > a.length) {
    c = a;
    a = b;
    b = c;
    c = undefined;
  }

  const res = [];

  exec();

  function exec() {
    let flg = false;
    let cur = b.shift();
    let tmp = [];
    a.forEach((chr) => {
      if (chr == cur) {
        flg = true;
        tmp.push(cur);
        cur = b.shift();
      } else {
        if (flg) {
          flg = false;
          if (tmp.length > 0) {
            res.push(tmp);
            tmp = [];
          }
          if (cur != undefined) {
            b.unshift(cur);
            exec();
          }
        }
      }
    });
    if (tmp.length > 0) {
      res.push(tmp);
      if (cur != undefined) {
        b.unshift(cur);
        exec();
      }
    }
  }
  return res;
};
HTMLElement.prototype.str = function () {
  return this.innerText;
};
HTMLElement.prototype.add = function (tag) {
  const el = document.createElement(tag);
  this.appendChild(el);
  return el;
};
HTMLElement.prototype.attr = function (str) {
  return this.getAttribute(str);
};
HTMLElement.prototype.gcn = function (str) {
  const els = this.getElementsByClassName(str);
  return Array.from(els);
};
HTMLElement.prototype.gtn = function (str) {
  const els = this.getElementsByTagName(str);
  return Array.from(els);
};
HTMLElement.prototype.gbn = function (str) {
  const els = this.getElementsByName(str);
  return Array.from(els);
};
HTMLElement.prototype.str = function (str) {
  return this.innerText;
};
HTMLElement.prototype.trav = function (fnc) {
  fnc(this);
  var a = this.children.length;
  for (var i = 0; i < a; i++) {
    if (this.children[i].trav) this.children[i].trav(fnc);
  }
};
HTMLElement.prototype.gba = function (attr, val, opt) {
  /* getElementsByAttribute */
  const res = [];
  this.trav((el) => {
    const str = el.attr(attr);
    if (!str) return;
    if (opt) {
      if (str.indexOf(val) != -1) res.push(el);
    } else {
      if (str == val) res.push(el);
    }
  });
  return res;
};
HTMLElement.prototype.nm = function () {
  /* node move */
  const args = Array.from(arguments);
  const up = args.shift();
  let el = this;
  for (let i = 0; i < up; i++) {
    const p = el.parentNode;
    if (p) el = p;
  }

  args.forEach((num) => {
    const p = el.children[num];
    if (p) el = p;
  });

  return el;
};
HTMLInputElement.prototype.setSafeValue = function (val) {
  const iptproto = HTMLInputElement.prototype;
  const objval = { bubbles: true, cancelable: true };
  const { set } = Object.getOwnPropertyDescriptor(iptproto, "value");
  const event = new Event("input", objval);
  set.call(this, val);
  this.dispatchEvent(event);
};
document.gcn = function (str) {
  const els = this.getElementsByClassName(str);
  return Array.from(els);
};
document.gtn = function (str) {
  const els = this.getElementsByTagName(str);
  return Array.from(els);
};
document.gbn = function (str) {
  const els = this.getElementsByName(str);
  return Array.from(els);
};
document.clm = function (str) {
  return document.createElement(str);
};
document.gba = function (attr, val, opt) {
  /* getElementsByAttribute */
  const res = [];
  this.body.trav((el) => {
    const str = el.attr(attr);
    if (!str) return;
    if (opt) {
      if (str.indexOf(val) != -1) res.push(el);
    } else {
      if (str == val) res.push(el);
    }
  });
  return res;
};
window.timer = function (time, callback) {
  setTimeout(callback, time);
};
/* 이 부분 자리 옮기지 마시오.*/
console.clear();


  const dict = {"https://www.respia.com/#/login": funcLogin,"https://www.respia.com/": funcReserve};

  function precheck() {}
  function funcLogin() {
    EXTZLOG("search", "funcLogin");

    const chk = LSCHK("TZ_SEARCH_LOGIN" + clubId, 5);
    if (!chk) {
      EXTZLOG("search", "funcLogin Timein ERROR");
      location.href = "https://www.respia.com/#/";
      return;
    }

    var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (doc.gbn("id").length == 0) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  const { set } = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  const event = new Event("input", {
    bubbles: true,
    cancelable: true,
  });
  const elId = doc.gbn("id")[0];
  const elPw = doc.gbn("pw")[0];
  set.call(elId, "${login_id}");
  elId.dispatchEvent(event);

  set.call(elPw, "${login_password}");
  elPw.dispatchEvent(event);

  doc.gcn("login_submit")[0].click();
  /* setTimeout(() => {
    doc.gcn("login_submit")[0].click();
  }, 1000); */
}


    return;
  }

  /* begin blocking infinite call */
let TZ_BOT_SAFETY = true;
let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
let curTimeforVisit = new Date().getTime();

EXTZLOG("search", "IC_CHK:" + [visitNumber, visitNumber == null].join(", "), {
  LOGID,
  step: "IC_CHK",
});
if (lsg("TZ_ADMIN_BLOCK_IC") != null) {
  if (curTimeforVisit - lastVistTime < 1000 * 15) {
    if (visitNumber > 9) {
      if (ac) ac.message(JSON.stringify({ command: "TZ_MSG_IC" }));
      TZ_BOT_SAFETY = false;
      /* 초기화 */
      visitNumber = 0;
      lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
      /* 로그아웃 */
      if (LOGOUT) LOGOUT();
    }
  } else {
    visitNumber = 0;
    lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
  }
} else {
  visitNumber = 0;
  lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
}
visitNumber++;
lss("TZ_ADMIN_BLOCK_IC", visitNumber);
EXTZLOG(
  "search",
  [
    "TZ_ADMIN_BLOCK_IC",
    lsg("TZ_ADMIN_BLOCK_IC"),
    lsg("TZ_ADMIN_BLOCK_IC_TIME"),
  ].join(", "),
  { LOGID, step: "IC_CHK" }
);
/* end blocking infinite call */

let global_param = {};
const COMMAND = "GET_DATE";
const clubId = "0b007235-f137-11ec-a93e-0242ac11000a";
const courses = {
  '단일': '0b03b115-f137-11ec-a93e-0242ac11000a',
};
EXTZLOG("search", ["startSearch", COMMAND].join(", "), { LOGID, step: "IC_CHK" });
const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setDate(28);
now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

EXTZLOG("search", ["targetMonth", thisdate, nextdate].join(", "), {
  LOGID,
  step: "EXEC",
});

let dates = [];
const result = [];
const golf_schedule = [];
let lmt;
function procDate() {
  const LOG_PRM = {
    LOGID,
    step: "procDate",
  };
  /* date search */
  if (COMMAND == "GET_DATE") {
    let golf_date = [];
    dates.forEach(([date]) => {
      golf_date.push(date.datify("-"));
    });
    EXTZLOG("search", "searchResult", LOG_PRM);
    const acParam = {
      LOGID,
      timestamp: new Date().getTime(),
    };
    if (golf_date.length == 0) {
      acParam.command = "NONE_OF_GET_DATE";
    } else {
      acParam.command = "SUCCESS_OF_GET_DATE";
      acParam.content = golf_date;
    }
    EXTZLOG("search", "DATERESULT", JSON.stringify(acParam));
    if (ac) {
      EXTZLOG("search", "sendToDevice", LOG_PRM);
      ac.message(JSON.stringify(acParam));
      lsc();
    }
    return;
  }
  /* time search */
  if (lmt === undefined && dates.length == 0) {
    dates.push(["${TARGET_DATE}", 0]);
  }

  EXTZLOG(
    "search",
    ["targetDate", "${TARGET_DATE}", dates.length].join(", "),
    LOG_PRM
  );

  const result = [];
  dates.every((arr) => {
    const [date] = arr;
    if (date == "${TARGET_DATE}") {
      result.push(arr);
    }
    return true;
  });
  dates = result;

  if (lmt === undefined) lmt = dates.length - 1;
  const arrDate = dates.shift();
  if (arrDate) {
    EXTZLOG("search", "mneCallDetail", LOG_PRM);
    mneCallDetail(arrDate);
  } else {
    EXTZLOG("search", "procGolfSchedule", LOG_PRM);
    procGolfSchedule();
  }
}
function procGolfSchedule() {
  const LOG_PRM = {
    LOGID,
    step: "procGolfSchedule",
  };
  golf_schedule.forEach((obj) => {
    obj.golf_course_name = obj.golf_course_id;
    let course_id = courses[obj.golf_course_id];
    if (!course_id && Object.keys(courses).length === 1)
      course_id = courses[Object.keys(courses)[0]];
    obj.golf_course_id = course_id;
    obj.date =
      obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
    if (obj.time.indexOf(":") == -1)
      obj.time = obj.time.gh(2) + ":" + obj.time.gt(2);
  });

  const acParam = {
    LOGID,
    timestamp: new Date().getTime(),
  };
  if (golf_schedule.length == 0) {
    acParam.command = "NONE_OF_GET_SCHEDULE";
  } else {
    acParam.command = "end of procGolfSchedule!";
    acParam.content = golf_schedule;
  }
  EXTZLOG("search", "searchResult," + acParam.command, LOG_PRM);
  if (ac) {
    EXTZLOG("search", "sendToDevice", LOG_PRM);
    ac.message(JSON.stringify(acParam));
    lsc();
  }
}
function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    date: dt,
  };
  get("//respiawas.xyz/logic/book/golf/list/monthly", param, {}, (data) => {
    const json = data.jp();
    const els = json;
    Array.from(els).forEach((el) => {
      const date = el + "";
      dates.push([date, ""]);
    });
    callback();
  });
}


function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "//respiawas.xyz/logic/book/golf/list/daily?date=" + date;
  const method = "post";
  const param = {
    responseType: "json",
    headers: {
      headers: {},
      lazyUpdate: null,
      normalizeName: {},
    },
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, { "Content-Type": "application/json" }, (data) => {
    const json = data.jp();
    const els = json;
    Array.from(els).forEach((el) => {
      let { date, hour, minute, course } = el;
      const time = hour.addzero() + minute.addzero();
      course = dictCourse[course];
      hole = 20;
      const fee = 100000;
      fee_normal = fee;
      fee_discount = fee;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
      });
    });
    procDate();
  });
}



  function LOGOUT() {
    log("LOGOUT");
    location.href="javascript:()=>{}";
  }

  function main() {
    EXTZLOG("search", "main");

    if (!TZ_BOT_SAFETY) {
      EXTZLOG("search", "stopped by Infinite Call");
      return;
    }

    const func = dict[addr];
    log("addr> ", addr);
    if (!func) funcOther();
    else func();
  }

  function funcList() {
    EXTZLOG("search", "funcList");
    location.href = "https://www.respia.com/#/";
    return;
  }
  function funcMain() {
    EXTZLOG("search", "funcMain");

    const chk = LSCHK("TZ_SEARCH_MAIN" + clubId, 10);
    EXTZLOG("search", ["timeout chk", chk].join(", "));

    if (!chk) {
      EXTZLOG("search", "funcMain Timein ERROR");
      return;
    }

    location.href = "https://www.respia.com/#/";
    return;
  }
  function funcOut() {
    EXTZLOG("search", "funcOut");

    funcEnd();

    return;
  }
  function funcOther() {
    EXTZLOG("search", "funcOther");
    /* SENDMQTT("script_error_in_system", addr, {stack: "link address error"}, addr); */

    const chk = LSCHK("TZ_SEARCH_OTHER" + clubId, 10);
    EXTZLOG("search", ["timeout chk", chk]);
    if (!chk) {
      EXTZLOG("search", ["funcOther Timein ERROR"]);
      return;
    }

    location.href = "https://www.respia.com/#/";

    return;
  }
  function funcReserve() {
    EXTZLOG("search", "funcSearch");

    if (location.href == addr) {
      const chk = LSCHK("TZ_SEARCH_RESERVE" + clubId, 5);
      EXTZLOG("search", ["timeout chk", chk].join(","));
      if (!chk) {
        EXTZLOG("search", "funcSearch Timein ERROR");
        return;
      }
    }

    
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});


    return;
  }

  try {
    main();    
  } catch (e) {
    /* SENDAC(e, "");
    SENDMQTT("script_error_in_system", "", e, ""); */
    console.log(e.toString());
    EXTZLOG("search", "script_error_in_system");
  }
  
})();

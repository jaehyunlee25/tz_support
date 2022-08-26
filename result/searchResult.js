javascript:(() => {   
  
    /* test */
const log = console.log;
const dir = console.dir;
const doc = document;
const ls = localStorage;
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const logParam = {
  type: "command",
  sub_type: "",
  device_id: "${deviceId}",
  device_token: "${deviceToken}",
  golf_club_id: "${golfClubId}",
  message: "",
  parameter: JSON.stringify({}),
};
let ac = false; 
try {
	ac = window.AndroidController || window.webkit.messageHandlers.iosController;
	ac.message = ac.message || window.webkit.messageHandlers.iosController.postMessage;
} catch(e) {
	ac = false;
}

const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
const aDDr = location.href.split(splitter)[0];
const suffix = location.href.split(splitter)[1];
const dictSplitter = { "#": "?", "?": "#" };
let addr = aDDr;
if (aDDr.indexOf(dictSplitter[splitter]) != -1)
  addr = aDDr.split(dictSplitter[splitter])[0];

logParam.sub_type = "url";
logParam.message = "raw addr :: " + location.href;
TZLOG(logParam);
logParam.message = "aDDr :: " + aDDr;
TZLOG(logParam);
logParam.message = "addr :: " + addr;
TZLOG(logParam);
log("addr", addr);

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
  this.jAjax = function (address, header) {
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
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.open("POST", addr, true);
    j.xmlHttp.send(prm);
  };
  function onError() {}
  function on_ReadyStateChange() {
    if (j.xmlHttp.readyState == 4) {
      if (j.xmlHttp.status == 200) {
        var data = j.xmlHttp.responseText;
        j.ajaxcallback(data);
      } else {
      }
    }
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
  return localStorage.clear();
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
String.prototype.inparen = function () {
  const regex = /.+?\((.+)\)/;
  const str = this.toString();
  const result = [];
  regex
    .exec(str)[1]
    .split("'")
    .join("")
    .split(",")
    .forEach((str) => {
      result.push(str.trim());
    });
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
String.prototype.regex = function (regex) {
  return this.replace(regex, "");
};
String.prototype.fillzero = function (sep) {
  const ar = this.split(sep);
  const result = [];
  ar.forEach((el) => {
    result.push(el.addzero());
  });

  return result.join("");
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
HTMLElement.prototype.str = function (str) {
  return this.innerText;
};
document.gcn = function (str) {
  const els = this.getElementsByClassName(str);
  return Array.from(els);
};
document.gtn = function (str) {
  const els = this.getElementsByTagName(str);
  return Array.from(els);
};
document.clm = function (str) {
  return document.createElement(str);
};
window.timer = function (time, callback) {
  setTimeout(callback, time);
};
/* 이 부분 자리 옮기지 마시오.*/
console.clear();

 
    const dict = {"http://www.oakvalley.co.kr/oak_new/login.asp": funcLogin,"https://reservation.oakvalley.co.kr/frontoffice/p_entrance.jsp": funcCalendar,"https://reservation.oakvalley.co.kr/frontoffice/golf/g_100.jsp": funcReserve};   

    function funcLogin() {
      log("funcLogin");
      
      const chk = LSCHK("TZ_SEARCH_LOGIN", 5);
      if(!chk) {
        location.href = "https://reservation.oakvalley.co.kr/frontoffice/p_entrance.jsp";
        return;
      }

      idt.value = '${login_id}';
pw.value = '${login_password}';
doLogin();
    
      return;
    }
    
    /* begin blocking infinite call */
let TZ_BOT_SAFETY = true;
let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
let curTimeforVisit = new Date().getTime();
log(visitNumber, visitNumber == null);
if(lsg("TZ_ADMIN_BLOCK_IC") != null) {
	log(1);
	if (curTimeforVisit - lastVistTime < 1000 * 15) {
		log(2);
		if (visitNumber > 9) {
			log(3);
			if(ac) ac.message("TZ_MSG_IC");
			TZ_BOT_SAFETY = false;
			/* 초기화 */
			visitNumber = 0;
			lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
			/* 로그아웃 */
			if (LOGOUT) LOGOUT();
		}
	} else {
		log(4);
		visitNumber = 0;
		lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
	}
} else {
	log(5);
	visitNumber = 0;
	lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
}
visitNumber++;
lss("TZ_ADMIN_BLOCK_IC", visitNumber);
log("TZ_ADMIN_BLOCK_IC", lsg("TZ_ADMIN_BLOCK_IC"), lsg("TZ_ADMIN_BLOCK_IC_TIME"));
/* end blocking infinite call */

/* var splitter = location.href.indexOf("?") == -1 ? "#" : "?";
var aDDr = location.href.split(splitter)[0];
var suffix = location.href.split(splitter)[1];
var dictSplitter = {"#": "?", "?": "#"};
var addr = aDDr;
if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
    addr = aDDr.split(dictSplitter[splitter])[0];

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr); */

const COMMAND = "GET_DATE";
const clubId = 'e5ece764-f8f4-11ec-a93e-0242ac11000a';
const courses = { 
	'In': 'e5eebede-f8f4-11ec-a93e-0242ac11000a',
	'Out': 'e5eebff1-f8f4-11ec-a93e-0242ac11000a',
};
log("step::", 1);const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
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

log(thisdate, nextdate);

let dates = [];
const result = [];
const golf_schedule = [];
let lmt;
function procDate() {
  if (lmt === undefined && dates.length == 0) {
    if (COMMAND == "GET_TIME") dates.push(["${TARGET_DATE}", 0]);
  }

  if (COMMAND == "GET_DATE") {
    if (dates.length > 0) {
      const golf_date = [];
      dates.forEach(([date]) => {
        logParam.sub_type = "search";
        logParam.message = date;
        logParam.parameter = JSON.stringify({
          clubId,
          date,
          type: typeof date,
        });
        TZLOG(logParam, (data) => {});
        golf_date.push(date.datify("-"));
      });
      const param = { golf_date, golf_club_id: clubId };
      post(
        OUTER_ADDR_HEADER + "/api/reservation/golfDate",
        param,
        header,
        (data) => {
          const json = JSON.parse(data);
          log(json.message);
          if (json.resultCode == 200) {
            if (ac) ac.message("SUCCESS_OF_GET_DATE");
          } else {
            if (ac) ac.message("FAIL_OF_GET_DATE");
          }
          LOGOUT();
        }
      );
    } else {
      log("예약가능한 날짜가 없습니다.");
      if (ac) ac.message("NONE_OF_GET_DATE");
      LOGOUT();
    }
    return;
  }

  if (COMMAND == "GET_TIME") {
    log("target date", "${TARGET_DATE}", dates.length);
    
    const result = [];
    dates.every((arr) => {
      const [date] = arr;
      if (date == "${TARGET_DATE}") {
        result.push(arr);
        return false;
      }
      return true;
    });
    dates = result;
  }

  if (lmt === undefined) lmt = dates.length - 1;
  const order = lmt - dates.length + 1;
  const arrDate = dates.shift();
  if (arrDate) {
    log("수집하기", order + "/" + lmt, arrDate[0]);
    log("TZ_PROGRESS," + order + "," + lmt + "," + arrDate[0]);
    const param = {
      type: "command",
      sub_type: "search",
      device_id: "${deviceId}",
      device_token: "${deviceToken}",
      golf_club_id: "${golfClubId}",
      message: "search",
      parameter: JSON.stringify({ order, total: lmt, date: arrDate[0] }),
    };
    TZLOG(param, (data) => {});
    mneCallDetail(arrDate);
  } else {
    procGolfSchedule();
  }
}
function procGolfSchedule() {
  golf_schedule.forEach((obj) => {
    let course_id = courses[obj.golf_course_id];
    if (!course_id && Object.keys(courses).length === 1)
      course_id = courses[Object.keys(courses)[0]];
    obj.golf_course_id = course_id;
    obj.date =
      obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
    if (obj.time.indexOf(":") == -1)
      obj.time = obj.time.gh(2) + ":" + obj.time.gt(2);
  });
  /* console.log(golf_schedule); */
  if (golf_schedule.length == 0) {
    log("예약가능한 시간이 없습니다.");
    if (ac) ac.message("NONE_OF_GET_SCHEDULE");
    LOGOUT();
    return;
  }
  const param = { golf_schedule, golf_club_id: clubId };
  post(addrOuter, param, header, (data) => {
    const json = JSON.parse(data);
    log(json.message);
    if (json.resultCode == 200) {
      if (ac) ac.message("end of procGolfSchedule!");
    } else {
      if (ac) ac.message("FAIL_OF_GET_SCHEDULE");
    }
    LOGOUT();
  });
}
function mneCall(date, callback) {
  timer(3000, ()=>{
  const param = {
      V_IN_GOLF_ID: "S1",
      V_IN_YEAR: date.gh(4),
      V_IN_MONTH: date.gt(2),
      V_IN_MEMNO: "",
      T_MONTH: date.gt(2),
    };
    post("/golf.calendar.pns?getCalendar_S1", param, {}, (data) => {
      const els = JSON.parse(data).entitys;
      Array.from(els).forEach((el) => {
        if (el.IT_OPEN_DESC != "신청하기") return;
        const fulldate = el.ORI_CD_DATE.split("-").join("");
        dates.push([fulldate, 0]);
      });
      callback();
    });
  });
}


function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    I: "In",
    O: "Out",
  };
  const arr = ["I", "O"];

  exec();

  function exec() {
    const courseCode = arr.shift();
    if (!courseCode) {
      procDate();
      return;
    }

    const param = {
      V_IN_GOLF_ID: "S1",
      V_IN_DATE: date.datify(),
      V_IN_COURSE: "O",
      V_IN_ROUND_TYPE: "4",
      ID_REF_CD: "",
      V_IN_MEMNO: "",
    };
    post("/golf.course.pns?getCourse_G", param, {}, (data) => {
      const els = JSON.parse(data).entitys;
      Array.from(els).forEach((el) => {
        const time = el.r_TIME.rm(":");
        const course = dictCourse[courseCode];
        fee_discount = el.ACT_GREENFEE * 1;
        fee_normal = el.ACT_GREENFEE * 1;
  
        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "18홀",
        });
      });
      exec();
    });
  }  
}


function funcCalendar() {
  log("funcCalendar");
  S1.click();
}
  function LOGOUT() {
    log("LOGOUT");
    location.href="/oak_new/login_exec.asp?logout=y"
  }
    
    function main() {
      log("main");

      if (!TZ_BOT_SAFETY) {
        log("stopped by Infinite Call");
        return;
      }

      const func = dict[addr];
      if (!func) funcOther();
      else func();
    }

    function funcList() {
      log("funcList");
      location.href = "https://reservation.oakvalley.co.kr/frontoffice/p_entrance.jsp";
      return;
    }
    function funcMain() {
      log("funcMain");
      location.href = "https://reservation.oakvalley.co.kr/frontoffice/p_entrance.jsp";
      return;
    }
    function funcOut() {
      log("funcOut");

      funcEnd();

      return;
    }
    function funcOther() {
      log("funcOther");

      const chk = LSCHK("TZ_SEARCH_OTHER", 5);
      if(!chk) return;
        
      location.href = "https://reservation.oakvalley.co.kr/frontoffice/p_entrance.jsp";

      return;
    }    
    function funcReserve() {
      log("funcSearch");

      const chk = LSCHK("TZ_SEARCH_RESERVE", 5);
      if(!chk) return;

      
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});

      return;
    }

    main();
})();
    
javascript:(() => {
/* test */
const log = console.log;
const dir = console.dir;
const doc = document;
const ls = localStorage;
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const logParam = {
  type: "command",
  sub_type: "start",
  device_id: "${deviceId}",
  device_token: "${deviceToken}",
  golf_club_id: "${golfClubId}",
  message: "start reserve/reserve",
  parameter: JSON.stringify({}),
};
let ac = false; 
try {
	ac = window.AndroidController || window.webkit.messageHandlers.iosController;
	ac.message = ac.message || window.webkit.messageHandlers.iosController.postMessage;
} catch(e) {
	ac = false;
}

function TZLOG(param, callback) {
  const addr = OUTER_ADDR_HEADER + "/api/reservation/newLog";
  post(addr, param, { "Content-Type": "application/json" }, (data) => {
    callback(data);
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
			if(window.AndroidController) 
				window.AndroidController.message("TZ_MSG_IC");
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

const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
const aDDr = location.href.split(splitter)[0];
const suffix = location.href.split(splitter)[1];
const dictSplitter = {"#": "?", "?": "#"};
let addr = aDDr;
if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
    addr = aDDr.split(dictSplitter[splitter])[0];

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr);
    
const dict = ${address_mapping};

const func = dict[addr];
const dictCourse = ${reserve_course_mapping};
const splitterDate = "${splitter_date}";
const fulldate = [year, month, date].join(splitterDate);

if (!func) funcOther();
else func();

function funcMain() {
  log("funcMain");
  return;
}
function funcOut() {
  log("funcOut");
  return;
}
function funcOther() {
  log("funcOther");
  return;
}
function funcLogin() {
  log("funcLogin");
  
  const tag = localStorage.getItem("TZ_LOGIN");
  if (tag && new Date().getTime() - tag < 1000 * 5) return;
  localStorage.setItem("TZ_LOGIN", new Date().getTime());

  

logParam.sub_type = "login";
message: "start login";
TZLOG(logParam, (data) => {}); 
dispUserId.value = '${login_id}';
dispUserPwd.value = '${login_password}';
chkLogValue();

  return;
}
function funcReserve() {
  log("funcReserve");
  return;
}
function funcExec() {
  log("funcExec");
  return;
}
function funcEnd() {
  log("funcEnd");
  return;
}
function LOGOUT() {
  log("LOGOUT");
  return;
}
})();

javascript: (() => {
  const log = console.log;
const dir = console.dir;
const doc = document;
const ls = localStorage;
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
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
console.clear();

  const logParam = {
    type: "command",
    sub_type: "reserve/search",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "ae0b0349-7dce-11ec-b15c-0242ac110005",
    message: "start reserve/search",
    parameter: JSON.stringify({}),
  };
  const addr = location.href.split("?")[0];
  const dict = {
    "https://paju.kmhleisure.com/Mobile/Member/LoginNew.aspx": funcLogin,
    "https://paju.kmhleisure.com/Mobile/Reservation/ReservationList.aspx": funcReserve,
    /* "https://www.dongchongc.co.kr:442/Mobile": funcMain, */
    "https://paju.kmhleisure.com/Mobile/Member/LogOut.aspx": funcOut,
  };
  
  log("raw addr :: ", location.href);
  log("addr :: ", addr);

  const func = dict[addr];
  if (!func) funcOther();
  else func();

  function funcOut() {
    log("funcOut");
    return;
  }
  function funcMain() {
    log("funcMain");
    const tag = localStorage.getItem("TZ_MAIN");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_MAIN", new Date().getTime());

    location.href = "https://paju.kmhleisure.com/Mobile/Reservation/ReservationList.aspx";
  }
  function funcOther() {
    log("funcOther");
    const tag = localStorage.getItem("TZ_OTHER");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_OTHER", new Date().getTime());

    location.href = "https://paju.kmhleisure.com/Mobile/Reservation/ReservationList.aspx";
  }
  function funcLogin() {
    log("funcLogin");
    
    const tag = localStorage.getItem("TZ_LOGOUT");
    if (tag && new Date().getTime() - tag < 1000 * 10) return;
    localStorage.setItem("TZ_LOGOUT", new Date().getTime());

    
const param = {
    type: "command", 
    sub_type: "login",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "ae0b0349-7dce-11ec-b15c-0242ac110005",
    message: "start login",
    parameter: JSON.stringify({}),
};
TZLOG(param, (data) => {
    log(data);
    user_id.value = 'mnemosyne';
user_pw.value = 'ya2ssarama!';
login();
});  
  }
  function funcReserve() {
    log("funcReserve");
    
    const tag = localStorage.getItem("TZ_RESERVE");
    if (tag && new Date().getTime() - tag < 1000 * 5) {
      funcEnd();
      return;
    }
    localStorage.setItem("TZ_RESERVE", new Date().getTime());

    TZLOG(logParam, (data) => {
      log(data);
      setTimeout(funcSearch, 1000);
    });
  }
  function funcSearch() {
    log("funcReserve");

    const els = document.gcn("reserveList")[0].gtn("a");
    const dictCourse = {
      11: "동",
      22: "서",
    };
    const result = [];
    Array.from(els).forEach((el) => {
      if(el.str() != "취소") return true;

      const param = el.attr("href").inparen();
      const elCompany = param[9];
      if(elCompany != "109") return true;
      
      const elDate = param[0];
      const elTime = param[1];
      const elCourse = param[2];
      
      console.log("reserve search", dictCourse[elCourse], elDate, elTime);
      result.push({ date: elDate, time: elTime, course: dictCourse[elCourse] });
    });
    const param = {
      golf_club_id: "ae0b0349-7dce-11ec-b15c-0242ac110005",
      device_id: "${deviceId}",
      result,
    };
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newReserveSearch";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      log(data);
      LOGOUT();
      funcEnd();
    });
  }
  function funcEnd() {
    log("funcEnd");
    const strEnd = "end of reserve/search";
    logParam.message = strEnd;
    TZLOG(logParam, (data) => {});
    const ac = window.AndroidController;
    if (ac) ac.message(strEnd);
  }
  function LOGOUT() {
    log("LOGOUT");
    location.href = "/Mobile/Member/LogOut.aspx";
  }
})();

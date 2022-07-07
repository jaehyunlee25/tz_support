javascript:(() => {
    function post(addr, param, header, callback) {
  var a = new ajaxcallforgeneral(),
    str = [];
  if (header['Content-Type'] == 'application/json') {
    str = JSON.stringify(param);
  } else {
    for (var el in param) str.push(el + '=' + encodeURIComponent(param[el]));
    str = str.join('&');
  }
  a.post(addr, str, header);
  a.ajaxcallback = callback;
}
function get(addr,param,header,callback){
    var a=new ajaxcallforgeneral(),
        str=[];
    for(var el in param){
        str.push(el+"="+param[el]);
    }
    str=str.join("&");
    a.jAjax(addr+"?"+str, header);
    a.ajaxcallback=callback;
};
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
    j.xmlHttp.open('GET', address, true);
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
    j.xmlHttp.open('POST', addr, true);

    if (header) {
      if (header['Content-Type'])
        Object.keys(header).forEach((key) => {
          var val = header[key];
          j.xmlHttp.setRequestHeader(key, val);
        });
      else
        j.xmlHttp.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
    } else {
      j.xmlHttp.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
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
    j.xmlHttp.open('POST', addr, true);
    j.xmlHttp.send(prm);
  };
  function onError() {
  }
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
Array.prototype.trav = function (fnc) {
  for (var i = 0, lng = this.length; i < lng; i++) {
    var a = fnc(this[i], i);
    if (a) break;
  }
};
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
  if(this.length == 1) return '0' + this;
  return this;
};
const log = console.log;
const dir = console.dir;

    const addr = location.href;
    if(addr == "https://www.midasgolf.co.kr/Member/Login") {
        (() => {
    user_id.value = 'mnemosyne';
    user_pwd.value = 'ilovegolf778';
    login();
})();
    } else if (addr == "https://www.midasgolf.co.kr/Reservation/ReservCalendar?lgubun=109") {
        const clubId = '053d7baf-ce10-11ec-a93e-0242ac11000a';
const courses = {
        밸리: 'b10b5290-ce10-11ec-a93e-0242ac11000a',
        마이다스: 'b10b54c2-ce10-11ec-a93e-0242ac11000a',
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { 'Content-Type': 'application/json' };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

console.log(thisdate, nextdate);

const dates = [];
const result = [];
const golf_schedule = [];

setTimeout(() => {
    mneCall(thisdate, procDate);
}, 1000);

function procDate() {
  const lmt = dates.length - 1;
  let cnt = 0;
  const timer = setInterval(() => {
    if(cnt > lmt) {
      clearInterval(timer);
      procGolfSchedule();
      return;
    }
    const [date] = dates[cnt];
          console.log('수집하기', cnt + '/' + lmt, date);
    mneCallDetail(date);
    cnt++;
  }, 300);
};
function procGolfSchedule() {
        golf_schedule.forEach((obj) => {
                obj.golf_course_id = courses[obj.golf_course_id];
                obj.date = obj.date.gh(4) + '-' + obj.date.ch(4).gh(2) + '-' + obj.date.gt(2);
        });
        console.log(golf_schedule);
        const param = { golf_schedule, golf_club_id: clubId };
        post(addrOuter, param, header, () => {
                const ac = window.AndroidController;
                if(ac) ac.message("end of procGolfSchedule!")
        });
};
function mneCallDetail(date) {
  const param = {
    lgubun: '109',
    date: date,
    changeDate: '',
    changeSeq: '',
  };
  post('/Reservation/AjaxTimeList', param, {}, (data) => {
    const ifr = document.createElement('div');
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName('tr');
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if(i === 0) return;

      const course = tr.getAttribute('data-coursekor');
      const time = tr.children[1].innerHTML;
      const fee_normal = tr.children[2].innerHTML.ct(1).replace(/\,/g,'') * 1;
      const fee_discount = tr.children[2].innerHTML.ct(1).replace(/\,/g,'') * 1;
      const slot = time.gh(2);

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: '',
        persons: '',
        fee_normal,
        fee_discount,
        others: '9홀',
      });
    });
  });
};
function mneCall(date, callback) {

  const atds = document.getElementsByTagName('td');
  const tds = [];
  Array.from(atds).forEach(td => {
    const tee = td.getAttribute('data-cnt');
    if(!tee || tee == 0) return;
    tds.push(td);
  });

  tds.forEach((td) => {
    const strDate = td.getAttribute('data-day');
    dates.push([strDate, 0]);
  });

  callback();
};
    } else {
        location.href = "https://www.midasgolf.co.kr/Reservation/ReservCalendar?lgubun=109";
    }
})();
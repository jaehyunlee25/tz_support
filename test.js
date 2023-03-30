function mneCall(date, callback) {
  intvEl = window["calBody"];
  ${mneCallCommon}
  function exec() {
    const str = (date + "01").datify();
    const param = {};
    Array.from(aspnetForm.elements).forEach(
      (el) => (param[el.name] = el.value)
    );
    param["ctl00$ContentPlaceHolder1$scManager"] =
      "ctl00$ContentPlaceHolder1$scManager|ctl00$ContentPlaceHolder1$btnUp";
    param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
    param["__EVENTARGUMENT"] = "";
    param["ctl00$ContentPlaceHolder1$htbArgs"] =
      "CALENDAR|" + str + "|" + str + "|date";
    param["__ASYNCPOST"] = true;
    post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const attr = "href";
      const els = ifr.gba(attr, "javascript:Update('LIST", true);
      EXTZLOG("search", ["els", JSON.stringify(param)].join(", "), logPrm);
      Array.from(els).forEach((el) => {
        if (el.nm(1).className.indexOf("possible") == -1) return;
        const attrStr = el.attr(attr).split(";").pop()
        const [str] = el.attr(attr).inparen();
        const [, , date, sign] = str.split("|");
        dates.push([date.rm("-"), sign, str]);
      });
      callback();
    });
  }
}

function mneCall(date, callback) {
  EXTZLOG("search", "mneCall");
  let count = 0;
  const mneT = setInterval(funcInterval, 500);
  const intvEl = doc.gcn("month1").length == 2;
  const logPrm = { LOGID, step: "mneCall_interval" };
  function funcInterval() {
    if (!intvEl) {
      EXTZLOG("search", ["interval count", count].join(", "), logPrm);
      count++;
      if (count > 10) {
        EXTZLOG("search", ["interval count out", count].join(", "), logPrm);
        clearInterval(mneT);
        callback();
      }
      return;
    }
    clearInterval(mneT);
    exec();
  }
  function exec() {
    const res = {};
    let els = doc.gcn("valid");
    Array.from(els).forEach((el, i) => {
      if (el.children.length == 0) return;
      const time = el.attr("time") * 1;
      const day = new Date(time);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1 + "").addzero();
      const dt = (day.getDate() + "").addzero();
      res[[year, month, dt].join("")] = true;
    });
    doc.gcn("btn_calendar_next")[0].click();
    els = doc.gcn("valid");
    Array.from(els).forEach((el, i) => {
      if (el.children.length == 0) return;
      const time = el.attr("time") * 1;
      const day = new Date(time);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1 + "").addzero();
      const dt = (day.getDate() + "").addzero();
      res[[year, month, dt].join("")] = true;
    });
    Object.keys(res).forEach((date) => {
      dates.push([date, ""]);
    });
    doc.gcn("btn_calendar_next")[0].click();
    els = doc.gcn("valid");
    Array.from(els).forEach((el, i) => {
      if (el.children.length == 0) return;
      const time = el.attr("time") * 1;
      const day = new Date(time);
      const year = day.getFullYear();
      const month = (day.getMonth() + 1 + "").addzero();
      const dt = (day.getDate() + "").addzero();
      res[[year, month, dt].join("")] = true;
    });
    EXTZLOG("search", Object.keys(res).length);
    const distinct = {};
    Object.keys(res).forEach((date) => {
      if (distinct[date]) return;
      distinct[date] = true;
      EXTZLOG("search", date);
      dates.push([date, ""]);
    });
    callback();
  }
}

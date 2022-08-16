function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "11",
    toDay: date + "01",
    calnum: "1",
  };
  post("real_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = Array.from(ifr.gcn("cal_live"));
    as.forEach((a) => {
      const param = a.attr("href").inparen();
      const [elDate] = param;
      dates.push([elDate, 0]);
    });
    callback();
  });
}

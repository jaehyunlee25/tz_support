function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    cal_month: thisdate == date ? 0 : 1,
  };
  get("/Mobile/01reservation/reservation.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gba("onclick", "javascript:transDate", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr("onclick").inparen();
      dates.push([date, ""]);
    });
    callback();
  });
}

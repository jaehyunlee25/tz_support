function mneCall(date, callback) {
  const els = doc.gcn("reserved");
  Array.from(els).forEach((el) => {
    const param = el.gcn("cm_day_box")[0].children[0].attr("href").inparen();
    const [date] = param;
    dates.push([date, ""]);
  });
  callback();
}

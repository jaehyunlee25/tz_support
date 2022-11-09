function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/reservation/ajax/golfTimeList";
  const method = "post";
  const param = {
    clickTdId: "A" + date,
    clickTdClass: "",
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: "",
    bookgTime: "",
    bookgCourse: "ALL",
    searchTime: "",
    agreeYn: "Y",
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "golfConfirm", true);
    Array.from(els).forEach((el) => {
      let [, date, time, sign, , , hole, fee_normal, fee_discount] = el
        .attr("onclick")
        .inparen(true);
      course = dictCourse[11];
      hole = hole.ct(1);
      fee_normal = fee_normal.rm(",") * 1;
      fee_discount = fee_discount.rm(",") * 1;

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

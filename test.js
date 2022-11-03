function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
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
    1: "사과",
    2: "나무",
  };

  post("/reservation/ajax/golfTimeList", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("btn-res");
    Array.from(els).forEach((el) => {
      let [date, time, course, , , hole, fee_normal, , fee_discount] = el
        .attr("onclick")
        .inparen();
      course = dictCourse[course];
      fee_normal = fee_normal * 1000;
      fee_discount = fee_discount * 1000;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}

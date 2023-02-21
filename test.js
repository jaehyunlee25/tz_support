function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/_mobile/golfRes/real_time_list.asp";
  const method = "post";
  const param = {
    pointdate: date,
    dategbn: gb,
    openyn: sign,
    agent_code: "",
    currentdate: "",
  };
  const dictCourse = {
    1: "Hill",
    2: "Lake",
    3: "Valley",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "goSend(", true);
    Array.from(els).forEach((el) => {
      let [, course, time] = el.attr(attr).inparen(true);
      course = dictCourse[course];
      hole = 18;
      fee_normal = 200000;
      fee_discount = 200000;

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

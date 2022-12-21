function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/_mobile/GolfRes/onepage/real_timelist_ajax_list.asp";
  const method = "post";
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "80",
    pointdate: date,
    openyn: sign,
    dategbn: gb,
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    1: "동코스",
    2: "서코스",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:subcmd", true);
    Array.from(els).forEach((el) => {
      let [, course, time, , , hole] = el.attr(attr).inparen();
      hole = hole.ct(1) * 1;
      course = dictCourse[course];
      const fee_normal = 210000;
      const fee_discount = 210000;

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

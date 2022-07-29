function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "10",
    pointdate: date,
    openyn: "1",
    dategbn: "2",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };

  post(
    "/oldcourse/_mobile/GolfRes/onepage/real_timelist_ajax_list.asp",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gcn("cm_dPdir");
      Array.from(els).forEach((el) => {
        const param = el.children[0].attr("href").inparen();
        let [, , time, course, , , , , fee_normal, fee_discount] = param;
        fee_normal *= 1;
        fee_discount *= 1;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "18홀",
        });
      });
      procDate();
    }
  );
}

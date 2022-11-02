function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {};
  const dictCourse = {
    A: "단일",
  };

  get("/booking/time/" + date, param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json;
    Array.from(els).forEach((el) => {
      const time = el.bk_time;
      const hole = el.bk_hole + "홀";
      const course = dictCourse[el.bk_cours];
      const fee_normal = el.bk_green_fee.rm(",") * 1;
      const fee_discount = fee_normal;
      log(date, time, course, hole, fee_normal, fee_discount);

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

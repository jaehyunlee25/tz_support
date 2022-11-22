function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/w/reservation/golfResv/service/ajax_booking_public_times.asp";
  const method = "post";
  const param = {
    date,
  };
  const dictCourse = {
    44: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        TRBM_COURSE: course,
        TRBM_DATE: date,
        TRBM_HOLE: hole,
        TRBM_TIME: time,
      } = el;
      course = dictCourse[course];
      const fee = "50000";
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;

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

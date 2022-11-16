function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/adm/cop/adb/select.do";
  const method = "post";
  const param = {
    match_day: date.datify(),
    gubun: "1",
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.res;
    Array.from(els).forEach((el) => {
      let { matchDay: date, matchTime: time, price: fee } = el;
      date = date.rm("-");
      time = time.rm(":");
      course = dictCourse[11];
      const hole = 9;
      fee = fee.rm(",") * 1;
      fee_normal = fee;
      fee_discount = fee;

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

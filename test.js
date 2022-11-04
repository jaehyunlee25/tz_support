function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    nwGroup: "160",
    Choice_Date: date.datify(),
    Day_Gubun: frm.Day_Gubun.value,
    chkDay: parseInt(date) + 123456789,
  };
  const dictCourse = {
    11: "단일",
  };

  post("/mobile/reserveCheck.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const frm = ifr.gtn("form")[0];
    const param = {};
    frm.gtn("input").forEach((ipt) => {
      param[ipt.name] = ipt.value;
    });
    post("/mobile/reserveTime.asp", param, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;
      const els = ifr.gba("href", "javascript:incode", true);
      Array.from(els).forEach((el) => {
        let [date, time, course] = el.attr("href").inparen();
        date = date.rm("-");
        course = dictCourse[11];
        fee_normal = 40000;
        fee_discount = 40000;
        const hole = "9홀";

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
  });
}

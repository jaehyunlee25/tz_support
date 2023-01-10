function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    book_date_bd: date,
    book_date_be: "",
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  const dictCourse = {
    1: "다산",
    2: "베아채",
    3: "장보고",
  };
  post("/html/reserve/reserve01.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "JavaScript:Book_Confirm1", true);
    Array.from(els).forEach((el, i) => {
      let [date, course, time] = el.attr(attr).inparen();
      const fee = el.nm(2, 4).str().rm(",") * 1;
      const hole = el.nm(2, 3).str().ct(1);
      course = dictCourse[course];

      let fee_normal = fee * 1;
      let fee_discount = fee * 1;

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

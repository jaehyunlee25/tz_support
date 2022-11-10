function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/Mobile/Reservation/Reservation.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$htbArgs"] = strParam;
  param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd";
  param["__EVENTTARGET"] = "ctl00$contents$lnkBtnUpd";

  post("ReservationCalendar.aspx", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("reservBtn");
    const dictCourse = {
      11: "파크",
      22: "밸리",
    };

    Array.from(els).forEach((el, i) => {
      const param = el.attr("onclick").inparen();
      let [elDate, time, elCourse] = param;
      const course = dictCourse[elCourse];
      const fee_discount =
        el.parentNode.parentNode.children[4].str().ct(1).split(",").join("") *
        1;
      const fee_normal =
        el.parentNode.parentNode.children[4].str().ct(1).split(",").join("") *
        1;
      const holes = el.parentNode.parentNode.children[2].str() + "홀";

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: holes,
      });
    });
    procDate();
  });
}

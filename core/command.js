mneCall(thisdate, () => {
  change_calendar((thisdate + "01").datify("/"), "next");
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
});

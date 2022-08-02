const logParam = {
  type: "command",
  sub_type: "reserve/reserve",
  device_id: "${deviceId}",
  device_token: "${deviceToken}",
  golf_club_id: "${golfClubId}",
  message: "start reserve/reserve",
  parameter: JSON.stringify({}),
};
const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
const aDDr = location.href.split(splitter)[0];
const suffix = location.href.split(splitter)[1];
const dictSplitter = {"#": "?", "?": "#"};
let addr = aDDr;
if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
    addr = aDDr.split(dictSplitter[splitter])[0];

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr);
    
const year = "${year}";
const month = "${month}";
const date = "${date}";
const course = "${course}";
const time = "${time}";
const dict = {
  ${address_mapping}
};

const func = dict[addr];
const dictCourse = {
  ${reserve_course_mapping}
};
const splitterDate = "${splitter_date}";
const fulldate = [year, month, date].join(splitterDate);

if (!func) funcOther();
else func();

function funcList() {
  log("funcList");
  return;
}
function funcMain() {
  log("funcMain");
  return;
}
function funcOut() {
  log("funcOut");
  return;
}
function funcOther() {
  log("funcOther");
  return;
}
function funcLogin() {
  log("funcLogin");
  return;
}
function funcReserve() {
  log("funcReserve");
  return;
}
function funcTime() {
  log("funcTime");
  return;
}
function funcExec() {
  log("funcExec");
  return;
}
function funcEnd() {
  log("funcEnd");
  return;
}
function LOGOUT() {
  log("LOGOUT");
  return;
}

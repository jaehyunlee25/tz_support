const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:dev.mnemosyne.co.kr");
const log = console.log;

client.on("connect", () => {
  log("connected!!");
  const param = {
    club: "asecovalley",
    club_id: "a0cffdd8-f12a-11ec-a93e-0242ac11000a",
    year: "2022",
    month: "08",
    date: "29",
    course: "단일",
    time: "0500",
    command: "search", // reserve, reserveSearch, reserveCancel, search
  };
  client.publish(
    "95b7a543-ea1d-11ec-a93e-0242ac11000a",
    JSON.stringify(param),
    {
      retain: true,
      qos: 0,
    }
  );
  client.end();
});
client.on("error", (err) => {
  log(err);
});

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:dev.mnemosyne.co.kr");
const log = console.log;

client.on("connect", () => {
  log("connected!!");
  const param = {
    club: "paju_KMH",
    club_id: "ae0b0349-7dce-11ec-b15c-0242ac110005",
    year: "2022",
    month: "08",
    date: "28",
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

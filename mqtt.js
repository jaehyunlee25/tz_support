const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:dev.mnemosyne.co.kr");
const log = console.log;

client.on("connect", () => {
  log("connected!!");
  const param = {
    club: "360cc",
    club_id: "a7fe6b1d-f05e-11ec-a93e-0242ac11000a",
    year: "2022",
    month: "08",
    date: "19",
    course: "Out",
    time: "0630",
    command: "reserveCancel", // reserve, reserveSearch, reserveCancel
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

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:dev.mnemosyne.co.kr");
const log = console.log;

client.on("connect", () => {
  log("connected!!");
  const param = {
    club: "lavieestbelle_old",
    club_id: "864dee33-ee26-11ec-a93e-0242ac11000a",
    year: "2022",
    month: "08",
    date: "01",
    course: "OUT",
    time: "1334",
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

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:dev.mnemosyne.co.kr");
const log = console.log;

client.on("connect", () => {
  log("connected!!");
  const param = {
    /* club: "paju_KMH",
    club_id: "ae0b0349-7dce-11ec-b15c-0242ac110005",
    year: "2022",
    month: "08",
    date: "28",
    course: "단일",
    time: "0500", */
    club: "",
    club_id: "",
    clubs: ["acro", "ariji"],
    command: "reserveSearchAll", // reserve, reserveSearch, reserveCancel, search
  };
  client.publish(
    "f4972159-1620-11ed-a93e-0242ac11000a", //기기마다 다름
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

const wsc = require("websocket").w3cwebsocket;
const client = new wsc("ws://dev.mnemosyne.co.kr:9001/", "echo-protocol");
client.onopen = () => {
  console.log("ws conned!!");
  client.send(
    JSON.stringify({
      command: "subscribe",
      topic: "TZLOG",
    })
  );
};
client.onclose = () => {};
client.onmessage = (e) => {
  if (!e.data) return;
  let json;
  try {
    json = JSON.parse(e.data);
  } catch (e) {
    console.log(e.data);
    return;
  }
  console.dir(json);
};

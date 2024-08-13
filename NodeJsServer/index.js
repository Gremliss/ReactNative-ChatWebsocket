const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message, isBinary) {
    const parsedMessage = JSON.parse(message.toString());
    const messageWithSender = {
      sender: parsedMessage.sender,
      text: parsedMessage.text,
    };

    console.log("NEW MESSAGE:", messageWithSender, isBinary);

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageWithSender));
      }
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(8080, () => {
  console.log("Listening to port: 8080");
});

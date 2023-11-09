// require your server and launch it here

const server = require("./api/server");

const Port = 6000;

server.get("*", (req, res) => {
  res.send("hopefully this messaaage goes through");
});

server.listen(Port, () => {
  console.log("server is listeing on", Port);
});

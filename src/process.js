import * as CFG from "../cfg";

export function processCommand(cmd, data) {
  switch (cmd) {
    // How many active connections there are
    case "/clients":
      var length = this.clients.length;
      this.print(`${length}:${CFG.SERVER_MAX_CONNECTIONS} connected players!`, 33);
    break;
    // Exit the server
    case "/exit":
      this.socket.close(() => {
        this.print("Closed http server!", 33);
        this.db.instance.close(() => {
          this.print("Closed database connection!", 33);
          this.print("Killed the server!", 31);
          setTimeout(() => process.exit(1), 2e3);
        });
      });
    break;
    case "/kick":
      this.kickPlayer(data[1]);
    break;
    case "/killall":
      var length = this.clients.length;
      this.removeAllPlayers();
      var result = length - this.clients.length;
      this.print(`Removed ${result} player${result === 1 ? "": "s"}!`);
    break;
    case "/clear":
      process.stdout.write("\x1Bc");
      this.greet();
    break;
    case "/help":
      this.printHelp();
    break;
    case "/save":
      this.saveAllPlayers();
      var length = this.clients.length;
      this.print(`Saved ${length} player${length === 1 ? "": "s"} into database!`);
    break;
    default:
      this.print(`${cmd} is not a valid command!`, 31);
    break;
  };
};

export function printHelp() {

  console.log("\x1b[36;1m===================================== HELP =====================================\x1b[0m");
  this.print("clients                      : how many players are connected");
  this.print("exit                         : exit the server");
  this.print("kick [PlayerUsername]        : kick player by username");
  this.print("kickall                      : kick all players");
  this.print("clear                        : clear the server console");
  this.print("save                         : save all palyers into database");
  console.log("\n\x1b[36;1m================================================================================\x1b[0m");

};

export function stdinInput(data) {
  data = data.toString().substring(0, data.length - 2);
  if (data.length < 1) return void 0;
  data = data.split(" ");
  var cmd = data[0];
  this.processCommand(cmd, data);
};

export function uncaughtException(excp) {
  switch (excp.errno) {
    case "EADDRINUSE":
      this.print(`Port ${CFG.SERVER_PORT} is already in use!`, 31);
    break;
    case "EACCES":
      this.print("No root privileges!", 31);
    break;
    default:
      console.log("Unhandled exception occurred: ", excp.code);
      console.log(excp.stack);
    break;
  };
  this.print("The server has crashed!", 31);
};
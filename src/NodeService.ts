import { ServerServiceInterface, DbService } from "serendip";
import { DbCollectionInterface } from "serendip-business-model";
import * as fs from "fs-extra";
import * as WebSocket from "ws";

export class NodeService implements ServerServiceInterface {
  public grid: {
    infs: {
      [key: string]: {
        hard: number;
        address: string;
        secret: string;
        type: string;
      };
    };
  };

  public nodeName = process.env.nodeName;

  public sockets: { [key: string]: WebSocket } = {};
  constructor(private dbService: DbService) {


  }

  async start() {
    this.grid = await fs.readJSON(".grid.json");

    this.connectSocket()
      .then()
      .catch();

    this.connectStats()
      .then()
      .catch();
  }

  async connectStats() {
    const send = async () => {
      for (const key in this.sockets) {
        if (this.sockets.hasOwnProperty(key)) {
          try {
            await new Promise(async (resolve, reject) => {
              const socket = this.sockets[key];
              if (!socket) return reject(new Error("no socket"));

              console.log("sending stats. ");

              socket.send(
                JSON.stringify({
                  type: "stat",
                  model: await this.dbService.stats()
                }),
                err => {
                  if (err) return reject(err);
                  resolve();
                }
              );
            });
          } catch (error) { }
        }
      }
      setTimeout(() => {
        send()
          .then(() => { })
          .catch(() => { });
      }, 10000);
    };

    send()
      .then(() => { })
      .catch(() => { });
  }

  responders: { [key: string]: (socketKey: string, input: any) => Promise<void> } = {

    "insert": async (socket, input) => {



    },

    "update": async (socket, input) => {

    },

    "delete": async (socket, input) => {

    },

    "find": async (socket, input) => {



    },

  };

  async connectSocket() {
    for (const key in this.grid.infs) {
      if (this.grid.infs.hasOwnProperty(key)) {
        const controller = this.grid.infs[key];

        if (controller.type !== "controller") return;

        if (this.sockets[key]) return;

        this.newSocket(
          controller.address.replace('http://', 'ws://').replace('https://', 'wss://'),
          "/sockets/" + this.nodeName,
          this.grid.infs[this.nodeName].secret,
          true
        )
          .then(socket => {
            this.sockets[key] = socket;


            socket.on('message', async (msg) => {
              let data: { type: string, model: any };
              try {
                data = JSON.parse(msg.toString());
              } catch (error) {
                return;
              }

              try {
                await this.responders[data.type](key, data.model);
              } catch (error) {
                console.error('responder catch error ', data, error)
              }

            });

            socket.on("close", () => {
              this.sockets[key] = null;
              this.connectSocket()
                .then()
                .catch();
            });

          })
          .catch(e => {
            console.log("new socket err");
          });
      }
    }
  }

  async newSocket(
    address: string,
    path: string,
    secret: string,
    retry?: boolean,
    maxRetry?: number
  ): Promise<WebSocket> {
    if (!path) {
      path = "/";
    }
    let tries = 1;

    if (!maxRetry) {
      maxRetry = 3000;
    }

    return new Promise<WebSocket>((resolve, reject) => {
      this.initiateSocket(address, path, secret)
        .then(ws => {
          resolve(ws);
        })
        .catch(ev => {
          console.log(

            `newSocket at ${path} initiate ended with catch`,
            ev.message
          );
          if (retry && maxRetry > 1) {
            console.log(

              `> WsService: trying again for newSocket at ${path} in 3sec`
            );
            const tryTimer = setInterval(() => {
              tries++;

              this.initiateSocket(address, path, secret)
                .then(ws => {
                  clearInterval(tryTimer);
                  return resolve(ws);
                })
                .catch(ev2 => {
                  console.log(

                    `newSocket at ${path} initiate ended with catch`,
                    ev2.message
                  );

                  if (maxRetry && tries === maxRetry) {
                    reject(ev2);
                  } else {
                    console.log(

                      `Trying again for newSocket at ${path} in 3sec`
                    );
                  }
                });
            }, 3000);
          } else {
            reject(ev);
          }
        });
    });
  }

  private initiateSocket(
    address,
    path: string,
    secret: string
  ): Promise<WebSocket> {
    return new Promise(async (resolve, reject) => {
      let wsConnection;

      const wsAddress = address + (path || "");

      try {
        wsConnection = new WebSocket(wsAddress);
      } catch (error) {
        reject(error);
      }

      wsConnection.onclose = ev => {
        reject(ev);
      };

      wsConnection.onerror = ev => {
        reject(ev);
      };

      wsConnection.onmessage = ev => {
        // FIXME: saw this method fired twice. find out why;
        // console.log("ws initiate onmessage", ev);
        if (ev.data === "authenticated") {
          resolve(wsConnection);
        } else {
          reject(new Error("authorization failed"));
        }
      };
      wsConnection.onopen = ev => {
        wsConnection.send(JSON.stringify({ type: "secret", model: secret }));

        // setInterval(() => {
        //   if (wsConnection.readyState == wsConnection.OPEN)
        //     wsConnection.send(new Date().toString());
        // }, 2000);
      };
    });
  }
}

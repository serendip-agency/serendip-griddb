import * as dotenv from "dotenv";
import { DbService, HttpService, Server, start } from "serendip";
import { MongodbProvider } from "serendip-mongodb-provider";

import { NodeController } from "./NodeController";
import { NodeService } from "./NodeService";

import * as fs from "fs-extra";

dotenv.config();

Server.dir = __dirname;

DbService.configure({
  defaultProvider: "Mongodb",
  providers: {
    Mongodb: {
      object: new MongodbProvider(),
      options: {
        mongoDb: process.env["db.mongoDb"],
        mongoUrl: process.env["db.mongoUrl"],
        authSource: process.env["db.authSource"],
        user: process.env["db.user"],
        password: process.env["db.password"]
      }
    }
  }
});

HttpService.configure({
  controllers: [NodeController],
  httpPort: parseInt(process.env["http.port"], 10)
});

start({
  logging: (process.env["core.logging"] as any) || "info",
  cpuCores: (process.env["core.cpuCores"] as any) || 1,
  services: [DbService, HttpService, NodeService]
})
  .then(async () => {
    // server started successfully

    console.log(
      "\n\t" +
        new Date().toLocaleString() +
        ` | Node node started: ${process.env.nodeName}\n`
    );
  })
  .catch(msg => console.log(msg));

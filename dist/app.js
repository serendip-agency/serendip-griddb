"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const serendip_1 = require("serendip");
const serendip_mongodb_provider_1 = require("serendip-mongodb-provider");
const NodeController_1 = require("./NodeController");
const NodeService_1 = require("./NodeService");
dotenv.config();
serendip_1.Server.dir = __dirname;
serendip_1.DbService.configure({
    defaultProvider: "Mongodb",
    providers: {
        Mongodb: {
            object: new serendip_mongodb_provider_1.MongodbProvider(),
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
serendip_1.HttpService.configure({
    controllers: [NodeController_1.NodeController],
    httpPort: parseInt(process.env["http.port"], 10)
});
serendip_1.start({
    logging: process.env["core.logging"] || "info",
    cpuCores: process.env["core.cpuCores"] || 1,
    services: [serendip_1.DbService, serendip_1.HttpService, NodeService_1.NodeService]
})
    .then(async () => {
    // server started successfully
    console.log("\n\t" +
        new Date().toLocaleString() +
        ` | Node node started: ${process.env.nodeName}\n`);
})
    .catch(msg => console.log(msg));

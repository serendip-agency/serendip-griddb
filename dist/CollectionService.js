"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
class CollectionService {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async start() {
        this.gridIndexing = await this.dbService.collection("GridIndexing", false);
        this.gridNodeLog = await this.dbService.collection("GridNodeLog", false);
        await this.gridNodeLog.insertOne({
            nodeName: process.env.nodeName,
            startDate: new Date(),
            gridConfig: fs.readJsonSync(".grid.json")
        });
    }
}
exports.CollectionService = CollectionService;

import { ServerServiceInterface, DbService } from "serendip";
import { DbCollectionInterface } from "serendip-business-model";
import * as fs from "fs-extra";

export class GridService implements ServerServiceInterface {
  public gridIndexing: DbCollectionInterface<any>;
  gridNodeLog: DbCollectionInterface<{}>;
  constructor(private dbService: DbService) {}

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

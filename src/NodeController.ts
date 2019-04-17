import {
  HttpControllerInterface,
  HttpEndpointInterface,
  DbService
} from "serendip";
import { DbCollectionInterface } from "serendip-business-model";
import { NodeService } from "./NodeService";

export class NodeController implements HttpControllerInterface {
  constructor(private dbService: DbService, private nodeService: NodeService) { }
  onRequest(req, res, next) {
    next();
  }

  public ensureIndex: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/collection/:collection/ensureIndex",
    actions: [
      async (req, res, next, done) => {
        const input: {
          fieldOrSpec: any;
          options: any;
          trackCollection: boolean;
        } = {
          fieldOrSpec: req.body.fieldOrSpec,

          options: req.body.options,
          trackCollection: req.body.trackCollection
        };


        const collectionName = req.params.collection;

        const collection = await this.dbService.collection(
          collectionName,
          false
        );

        await collection.ensureIndex(input.fieldOrSpec, input.options);

        done(200);
      }
    ]
  };

  public dropCollection: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/collection/:collection/dropCollection",
    actions: [
      async (req, res, next, done) => {
        const collectionName = req.params.collection;
        await this.dbService.dropCollection(collectionName);
        done(200);
      }
    ]
  };

  public dbStats: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/db/stats",
    actions: [
      async (req, res, next, done) => {
        const collectionName = req.params.collection;
        res.json(await this.dbService.stats());
      }
    ]
  };

  public find: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/collection/:collection/find",
    actions: [
      async (req, res, next, done) => {
        const input: {
          query?;
          skip?: any;
          limit?: any;
          trackCollection: boolean;
        } = {
          query: req.body.query,
          skip: req.body.skip,
          limit: req.body.limit,
          trackCollection: req.body.trackCollection
        };

        const collectionName = req.params.collection;

        const collection: DbCollectionInterface<
          any
        > = await this.dbService.collection<any>(
          collectionName,
          input.trackCollection
        );

        res.json(await collection.find(input.query, input.skip, input.limit));
      }
    ]
  };

  public count: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/collection/:collection/count",
    actions: [
      async (req, res, next, done) => {
        const input: { query?; trackCollection: boolean } = {
          query: req.body.query,
          trackCollection: req.body.trackCollection
        };
        const collectionName = req.params.collection;
        const collection: DbCollectionInterface<
          any
        > = await this.dbService.collection<any>(
          collectionName,
          input.trackCollection
        );
        res.json(await collection.count(input.query));
      }
    ]
  };

  public updateOne: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/collection/:collection/updateOne",
    actions: [
      async (req, res, next, done) => {
        const input: {
          model: any;
          userId?: string;
          tackOptions?: { metaOnly: boolean };
          trackCollection: boolean;
        } = {
          model: req.body.model,
          userId: req.body.userId,
          tackOptions: req.body.tackOptions,
          trackCollection: req.body.trackCollection
        };
        const collectionName = req.params.collection;
        const collection: DbCollectionInterface<
          any
        > = await this.dbService.collection<any>(
          collectionName,
          input.trackCollection
        );
        res.json(
          await collection.updateOne(
            input.model,
            input.userId,
            input.tackOptions
          )
        );
      }
    ]
  };

  public deleteOne: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/collection/:collection/deleteOne",
    actions: [
      async (req, res, next, done) => {
        const input: {
          _id: string;
          userId?: string;
          tackOptions?: { metaOnly: boolean };
          trackCollection: boolean;
        } = {
          _id: req.body._id,
          userId: req.body.userId,
          tackOptions: req.body.tackOptions,
          trackCollection: req.body.trackCollection
        };
        const collectionName = req.params.collection;
        const collection: DbCollectionInterface<
          any
        > = await this.dbService.collection<any>(
          collectionName,
          input.trackCollection
        );
        res.json(
          await collection.deleteOne(input._id, input.userId, input.tackOptions)
        );
      }
    ]
  };

  public insertOne: HttpEndpointInterface = {
    publicAccess: true,
    method: "POST",
    route: "/api/collection/:collection/insertOne",
    actions: [
      async (req, res, next, done) => {
        const input: {
          model: any;
          userId?: string;
          tackOptions?: { metaOnly: boolean };
          trackCollection: boolean;
        } = {
          model: req.body.model,
          userId: req.body.userId,
          tackOptions: req.body.tackOptions,
          trackCollection: req.body.trackCollection
        };
        const collectionName = req.params.collection;
        const collection: DbCollectionInterface<
          any
        > = await this.dbService.collection<any>(
          collectionName,
          input.trackCollection
        );
        res.json(
          await collection.insertOne(
            input.model,
            input.userId,
            input.tackOptions
          )
        );
      }
    ]
  };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeController {
    constructor(dbService, nodeService) {
        this.dbService = dbService;
        this.nodeService = nodeService;
        this.ensureIndex = {
            publicAccess: true,
            method: "POST",
            route: "/api/collection/:collection/ensureIndex",
            actions: [
                async (req, res, next, done) => {
                    const input = {
                        fieldOrSpec: req.body.fieldOrSpec,
                        options: req.body.options,
                        trackCollection: req.body.trackCollection
                    };
                    const collectionName = req.params.collection;
                    const collection = await this.dbService.collection(collectionName, false);
                    await collection.ensureIndex(input.fieldOrSpec, input.options);
                    done(200);
                }
            ]
        };
        this.dropCollection = {
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
        this.dbStats = {
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
        this.find = {
            publicAccess: true,
            method: "POST",
            route: "/api/collection/:collection/find",
            actions: [
                async (req, res, next, done) => {
                    const input = {
                        query: req.body.query,
                        skip: req.body.skip,
                        limit: req.body.limit,
                        trackCollection: req.body.trackCollection
                    };
                    const collectionName = req.params.collection;
                    const collection = await this.dbService.collection(collectionName, input.trackCollection);
                    res.json(await collection.find(input.query, input.skip, input.limit));
                }
            ]
        };
        this.count = {
            publicAccess: true,
            method: "POST",
            route: "/api/collection/:collection/count",
            actions: [
                async (req, res, next, done) => {
                    const input = {
                        query: req.body.query,
                        trackCollection: req.body.trackCollection
                    };
                    const collectionName = req.params.collection;
                    const collection = await this.dbService.collection(collectionName, input.trackCollection);
                    res.json(await collection.count(input.query));
                }
            ]
        };
        this.updateOne = {
            publicAccess: true,
            method: "POST",
            route: "/api/collection/:collection/updateOne",
            actions: [
                async (req, res, next, done) => {
                    const input = {
                        model: req.body.model,
                        userId: req.body.userId,
                        tackOptions: req.body.tackOptions,
                        trackCollection: req.body.trackCollection
                    };
                    const collectionName = req.params.collection;
                    const collection = await this.dbService.collection(collectionName, input.trackCollection);
                    res.json(await collection.updateOne(input.model, input.userId, input.tackOptions));
                }
            ]
        };
        this.deleteOne = {
            publicAccess: true,
            method: "POST",
            route: "/api/collection/:collection/deleteOne",
            actions: [
                async (req, res, next, done) => {
                    const input = {
                        _id: req.body._id,
                        userId: req.body.userId,
                        tackOptions: req.body.tackOptions,
                        trackCollection: req.body.trackCollection
                    };
                    const collectionName = req.params.collection;
                    const collection = await this.dbService.collection(collectionName, input.trackCollection);
                    res.json(await collection.deleteOne(input._id, input.userId, input.tackOptions));
                }
            ]
        };
        this.insertOne = {
            publicAccess: true,
            method: "POST",
            route: "/api/collection/:collection/insertOne",
            actions: [
                async (req, res, next, done) => {
                    const input = {
                        model: req.body.model,
                        userId: req.body.userId,
                        tackOptions: req.body.tackOptions,
                        trackCollection: req.body.trackCollection
                    };
                    const collectionName = req.params.collection;
                    const collection = await this.dbService.collection(collectionName, input.trackCollection);
                    res.json(await collection.insertOne(input.model, input.userId, input.tackOptions));
                }
            ]
        };
    }
    onRequest(req, res, next) {
        next();
    }
}
exports.NodeController = NodeController;

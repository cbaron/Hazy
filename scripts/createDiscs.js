#!/usr/bin/env node
require('node-env-file')(`${__dirname}/../.env`);

const Mongo = require('../dal/Mongo.js');
const DiscTypeFactory = require('../models/DiscTypeFactory');
const MyObject = require('../lib/MyObject');

const usage = "Usage: node createDiscs.js [numberOfDiscs]";
const quantity = process.argv[2];

const validate = (quantity) => {
    if (isNaN(quantity)) {
        throw usage;
    }

    return null;
};

const createOneDisc = () => {
    return DiscTypeFactory.create();
    // disc._store();
};

const createDiscs = (db) => {
    let discs = [];
    for (let i = quantity; i > 0; i--) {
        discs.push(createOneDisc());
    }

    db.collection('DiscTypes').insertMany(discs, function (err, result) {
        console.log(`Inserted ${quantity} documents into the DiscTypes collection.`);
        db.close();
    });
};

MyObject.P(validate, [quantity])
        .then(Mongo.Client.connect(process.env.MONGODB, (err, db) => {
            createDiscs(db);
        }))
        .catch(e => {
            console.error(e.stack || e);
            process.exit(1)
        });

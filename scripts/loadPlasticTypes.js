#!/usr/bin/env node

require('node-env-file')( `${__dirname}/../.env` )

Mongo = require('../dal/Mongo')

Mongo.getDb()
.then( db =>
    db.createCollection('PlasticType')
    .then( () =>
        db.collection('PlasticType').insertMany( [
            { name: 'dx', label: 'DX' },
            { name: 'champion', label: 'Chamption' },
            { name: 'glow', label: 'Glow' },
            { name: 'star', label: 'Star' },
        ] )
    )
)
.catch( e => Promise.resolve( console.log( e.stack || e ) ) )
.then( () => process.exit(0) )

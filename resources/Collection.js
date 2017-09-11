module.exports = Object.assign( { }, require('./__proto__'), {

    Fs: require('fs'),

    DELETE() {
        return this.getUser()
        .then( () => this.validateUser() )
        .then( () => this.Mongo.getDb() )
        .then( db => db.dropCollection( this.path[1] ) )
        .then( collection => {
            this.Mongo.removeCollection( collection.collectionName )
            return Promise.resolve( this.respond( { body: { name: this.path[1] } } ) )
        } )
    },

    GET() {
        return Promise.resolve(
            this.respond( {
                body: this.Mongo.collectionNames.map( name =>
                    ( { name, schema: this.Fs.existsSync( `${__dirname}/../models/${name}.js` ) ? require(`../models/${name}`) : { } } )
                )
            } )
        )
    },

    PATCH() { return Promise.resolve( this.respond( { stopChain: true, code: 404 } ) ) },

    POST() {
        return this.getUser()
        .then( () => this.validateUser() )
        .then( () => this.slurpBody() )
        .then( () => this.Mongo.getDb() )
        .then( db => db.createCollection( this.body.name ) )
        .then( collection => {
            this.Mongo.addCollection( collection.collectionName )
            return Promise.resolve( this.respond( { body: { name: collection.collectionName } } ) )
        } )
    },

    PUT() { return Promise.resolve( this.respond( { stopChain: true, code: 404 } ) ) }
} )

module.exports = Object.assign( { }, require('./__proto__'), {

    GET() { return Promise.resolve( this.respond( { body: this.Mongo.collectionNames } ) ) },

    POST() {
        return this.getUser()
        .then( () => this.validateUser() )
        .then( () => this.slurpBody() )
        .then( () => this.Mongo.getDb() )
        .then( db => db.createCollection( this.body.name ) )
        .then( collection => Promise.resolve( this.respond( { body: collection.collectionName } ) ) )
    }
} )

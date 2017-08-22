module.exports = Object.assign( { }, require('./__proto__'), {

    DELETE() {
        return this.getUser()
        .then( () => this.validateUser() )
        .then( () => this.Mongo.getDb() )
        .then( db => db.dropCollection( this.path[1] ) )
        .then( collection => {
            this.Mongo.collectionNames = this.Mongo.collectionNames.filter( name => name != this.path[1] )
            return Promise.resolve( this.respond( { body: { name: this.path[1] } } ) )
        } )
    },

    GET() { return Promise.resolve( this.respond( { body: this.Mongo.collectionNames.map( name => ( { name } ) ) } ) ) },

    POST() {
        return this.getUser()
        .then( () => this.validateUser() )
        .then( () => this.slurpBody() )
        .then( () => this.Mongo.getDb() )
        .then( db => db.createCollection( this.body.name ) )
        .then( collection => {
            this.Mongo.collectionNames.push( collection.collectionName )
            return Promise.resolve( this.respond( { body: { name: collection.collectionName } } ) )
        } )
    }
} )

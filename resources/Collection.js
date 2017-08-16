module.exports = Object.assign( { }, require('./__proto__'), {

    GET() { return Promise.resolve( this.respond( { body: this.Mongo.collectionNames } ) ) }

} )

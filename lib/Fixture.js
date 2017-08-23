module.exports = Object.create( Object.assign( {}, require('../../lib/MyObject'), {

    apply( name, opts ) { return this[ name ]( opts ) },

    constructor() {
        return this.apply.bind(this)
    },

    Mongo: require('../dal/Mongo'),

    /*
    MongoObj( { name, bootstrap={} } ) {
        return ( typeof bootstrap === 'function'
            ? Promise.resolve( bootstrap() )
            : bootstrap.then
                ? bootstrap.then( data => Promise.resolve.data )
                : Promise.resolve( bootstrap )
        )
        .then( bootstrappedData =>
            Promise.all(
                this.Mongo.model[ name ].attributes
                    .filter( attribute => bootstrappedData[ attribute.name ] === undefined )
                    .map( attribute => this.ColumnFixture( attribute ).then( result => bootstrappedData[ attribute.name ] = result ) )
            ).then( () => Promise.resolve( bootstrappedData ) )
    },
    */
    
    Photo( {w: w, h: h} = { w: 300, h: 300 } ) {
        const qs = `${new Date().getTime()}${this.getRandomInclusiveInteger( 1, 1000 )}`
        return {
            w,
            h,
            uri: `http://loremflickr.com/${w}/${h}?${qs}`
        }
    }
} ) ).constructor()

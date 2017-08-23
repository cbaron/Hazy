module.exports = Object.create( Object.assign( { }, require('../lib/MyObject'), {

    Client: require('mongodb').MongoClient,

    Fs: require('fs'),
    
    Mongo: require('mongodb'),

    GET( resource ) {
        if( resource.query.countOnly ) return this.handleCountOnly( resource )

        const cursorMethods = [ 'skip', 'limit', 'sort' ].reduce(
            ( memo, attr ) => {
                if( resource.query[ attr ] !== undefined ) { memo[attr] = resource.query[attr]; delete resource.query[attr] }
                return memo
            },
            { skip: 0, limit: 2147483648, sort: { } }
        );
       
        return this.forEach(
            db => db.collection( resource.path[0] ).find( resource.query ).skip( cursorMethods.skip ).limit( cursorMethods.limit ).sort( cursorMethods.sort ),
            result => Promise.resolve( result ),
            this
        )
        .then( results => Promise.resolve( results.length === 1 ? results[0] : results ) )
    },

    PUT( resource ) {
        return this.getDb()
        .then( db => db.collection( resource.path[0] ).update( { _id: new ( this.Mongo.ObjectID )( resource.path[1] ) }, resource.body ) )
        .then( result => Promise.resolve( [ Object.assign( { _id: resource.path[1] }, resource.body ) ] ) )
    },

    forEach( cursorFn, callbackFn, thisVar ) {
        return this.getDb()
        .then( db => {
            let cursor = Reflect.apply( cursorFn, thisVar, [ db ] )
            return new Promise( ( resolve, reject ) => {
                let rv = [ ],
                    handler = function( item ) {
                        if( item === null ) {
                            db.close()
                            return resolve(rv)
                        }

                        Reflect.apply( callbackFn, thisVar, [ item, db ] )
                        .then( result => {
                            rv.push( result )
                            return cursor.next()
                        } )
                        .then( handler )
                        .catch( reject )
                    }
                    
                cursor.next()
                .then( handler )
                .catch( reject )
            } )
        } )
    },


    cacheCollection( collection ) {
        return Promise.resolve( this.collections[ collection.name ] = { } )
    },

    handleCountOnly( resource ) {
        delete resource.query.countOnly

        return this.getDb()
        .then( db => db.collection( resource.path[0] ).count( resource.query ) )
        .then( result => Promise.resolve( { result } ) )
    },

    initialize() {
        return this.forEach( db => db.listCollections( { name: { $ne: 'system.indexes' } } ), this.cacheCollection, this )
        .then( () => {
            this.collectionNames = Object.keys( this.collections ).sort()
            this.model = { }
            /*
            return this.P( this.Fs.readdir, [ `${__dirname}../models` ], this.fs )
            .then( files => {
                files.forEach( filename => {
                    const name = filename.replace('.js','')
                this.model[ name ] = require( `${__dirname}../models/${name}` ) this.filter( this.collectionNames, name => this.reducer( this.collectionNames, name => ( { name:  } ) )
            */
            return Promise.resolve()
        } )
    },

    getDb() { return this.Client.connect(process.env.MONGODB) },
    
} ), { collections: { value: { } } } )

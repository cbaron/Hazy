module.exports = Object.create( Object.assign( { }, require('../lib/MyObject'), {

    Client: require('mongodb').MongoClient,

    Fs: require('fs'),
    
    Mongo: require('mongodb'),

    ObjectId( id ) { return new ( this.Mongo.ObjectID )( id ) },

    SuperModel: require( '../models/__proto__'),

    DELETE( resource, id ) {
        return this.getDb()
        .then( db => db.collection( resource.path[0] ).remove( { _id: this.ObjectId( id || resource.path[1] ) } ) )
        .then( result => Promise.resolve( [ { } ] ) )
    },

    GET( resource ) {
        if( resource.path.length === 2 ) return this.handleSingleDocument( resource )
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

    POST( resource ) {
        return this.getDb()
        .then( db => db.collection( resource.path[0] ).insert( resource.body ) )
        .then( result => Promise.resolve( [ Object.assign( { _id: result.insertedIds[0] }, resource.body ) ] ) )
    },

    PUT( resource, id ) {
        return this.getDb()
        .then( db => db.collection( resource.path[0] ).replaceOne( { _id: new ( this.Mongo.ObjectID )( id || resource.path[1] ) }, this.transform( resource.path[0], resource.body ) ) )
        .then( result => Promise.resolve( [ Object.assign( { _id: id || resource.path[1] }, resource.body ) ] ) )
    },

    addCollection( name ) {
        this.routes[ name ] = '__proto__'
        this.collectionNames.push( name )
        this.model[ name ] = this.SuperModel.create()
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
        return Promise.resolve( this.model[ collection.name ] = false )
    },

    handleCountOnly( resource ) {
        delete resource.query.countOnly

        return this.getDb()
        .then( db => db.collection( resource.path[0] ).count( resource.query ) )
        .then( result => Promise.resolve( { result } ) )
    },

    handleSingleDocument( resource ) {
        return this.getDb()
        .then( db => db.collection( resource.path[0] ).findOne( { _id: this.ObjectId( resource.path[1] ) } ) )
    },

    initialize( routes ) {
        this.routes = routes
        return this.forEach( db => db.listCollections( { name: { $ne: 'system.indexes' } } ), this.cacheCollection, this )
        .then( () => {
            this.collectionNames = Object.keys( this.model ).sort()
            this.model = { }
            return this.P( this.Fs.readdir, [ `${__dirname}/../models` ], this.Fs )
            .then( ( [ files ] ) => {
                files.forEach( filename => {
                    const name = filename.replace('.js','')
                    if( this.collectionNames.includes( name ) ) {
                        this.model[ name ] = require( `${__dirname}/../models/${name}` )
                    }
                } )
                this.collectionNames.forEach( name => {
                    if( this.model[ name ] === false ) this.model[ name ] = this.SuperModel.create()
                } )
                return Promise.resolve()
            } )
        } )
    },

    getDb() { return this.Client.connect(process.env.MONGODB) },

    removeCollection( collectionName ) {
        this.collectionNames = this.collectionNames.filter( name => name != collectionName )
        delete this.model[ collectionName ]
    },

    transform( collectionName, document ) {
        if( !this.model[ collectionName ] ) return document

        this.model[ collectionName ].attributes.forEach( attribute => {
            if( attribute.fk && document[ attribute.fk ] ) document[ attribute.fk ] = new ( this.Mongo.ObjectID )( document[ attribute.fk ] )
        } )

        return document
    },
    
} ), { model: { value: { } } } )

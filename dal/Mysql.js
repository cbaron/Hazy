const MyObject = require('../lib/MyObject')

module.exports = Object.create( Object.assign( {}, MyObject, {

    addDiscOnPos( data ) {
        return this.query( `INSERT INTO ospos_items SET ?`, data )
    },

    deleteDiscFromPos( id ) {
        return this.query( `DELETE FROM ospos_items WHERE item_number = ?`, [ id ] )
    },

    selectFromPos( where = { }, opts = { } ) {
        const keys = Object.keys( where ),
            whereClause = keys.length ? `WHERE ${keys.map( key => `${key} = ?` ).join(' AND ')}` : ``

        return this._factory( opts ).query( `SELECT * FROM ospos_items ${whereClause}`, keys.map( key => where[key] ) )
    },

    updateDiscOnPos( patch, where ) {
        const patchKeys = Object.keys( patch ),
            setClause = patchKeys.map( key => `${key} = ?` ).join(', '),
            whereKeys = Object.keys( where ),
            whereClause = whereKeys.map( key => `${key} = ?` ).join(' AND '),
            allKeys = patchKeys.concat( whereKeys )

        return this._factory().query(
            `UPDATE ospos_items SET ${setClause} WHERE ${whereClause}`,
            allKeys.map( ( key, i ) => i < patchKeys.length ? patch[ key ] : where[ key ] )
        )
    },

    query( query, args, opts = { } ) {
        return this._factory( opts ).query( query, args )
    },

    _factory( data ) {
        return Object.create( {

            P: MyObject.P,

            connect() {
                return new Promise( ( resolve, reject ) => {
                    this.pool.getConnection( ( err, connection ) => {
                        if( err ) return reject( err )

                        this.client = connection
                        this.done = connection.release
                     
                        resolve()
                    } )
                } )
            },

            query( query, args ) {
                return this.connect().then( () =>
                    new Promise( ( resolve, reject ) => {
                        this.client.query( query, args, ( err, results, fields ) => {
                            this.done()

                            if( err ) { console.log( query, args ); return reject( err ) }

                            resolve( results )
                        } )
                    } )
                )
            }
        }, { pool: { value: this.pool } } )
    }

} ), {
    pool: { value: new (require('mysql')).createPool( {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT
    } ) }
} )
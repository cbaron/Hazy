module.exports = Object.create( Object.assign( { }, require('../../lib/MyObject'), {

    Auth: require('./Auth'),

    Chai: require('chai'),
    
    ColumnFixture: require('./ColumnFixture'),

    Model: require('./Model'),
    
    Postgres: require('../../dal/Postgres'),
    
    Request: require('./Request'),

    assert( opts ) {
        this.Postgres.tables[ opts.name ].columns
        .filter( column => opts.filter ? opts.filter(column) : true )
        .forEach( column => this.Chai.assert.isDefined( opts.model[ column.name ], `${column.name} is not defined` ) )
    },

    create() {
        return Promise.all(
            this.Postgres.tables[ this.resource ].columns
                .filter( column => column.name !== 'id' && this.data[ column.name ] === undefined )
                .map( column => this.ColumnFixture( column, { headers: this._getHeaders() } ).then( result => this.data[ column.name ] = result ) )
        ).then( () => Promise.resolve( this.data ) )
    },

    /*
    create( opts={} ) {
        return ( opts.token
            ? Promise.resolve(opts.token)
            : this.Auth.getToken( { id: -1 } )
        )
        .then( token => 
            Promise.all( Array.from( Array( opts.count || 1 ).keys() ).map( i => {
                const data = typeof opts.bootstrap === 'function' ? opts.bootstrap( i ) : { }
                return ( typeof data.then === 'function' ? data : Promise.resolve( data ) )
                .then( modelData => {
                    const resource = Object.create( this.Model, {
                        resource: { value: opts.name },
                        data: { value: modelData },
                        token: { value: token }
                    } )
                    return resource.create().then( () => resource.save( { method: opts.method } ) )
                } )
            } ) ) 
        )
    },
    */

    put( opts ) {
        return this.create( Object.assign( opts, { method: 'PUT' } ) )
    },

} ), { } )

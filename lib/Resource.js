module.exports = Object.create( Object.assign( { }, require('../../lib/MyObject'), {

    Auth: require('./Auth'),

    Chai: require('chai'),

    Model: require('./Model'),

    assert( opts ) {
        this.Postgres.tables[ opts.name ].columns
        .filter( column => opts.filter ? opts.filter(column) : true )
        .forEach( column => this.Chai.assert.isDefined( opts.model[ column.name ], `${column.name} is not defined` ) )
    },

    create( opts={} ) {
        return ( opts.token
            ? Promise.resolve(opts.token)
            : this.Auth.getToken( { id: -1 } )
        )
        .then( token => 
            Promise.all( Array.from( Array( opts.count ).keys() ).map( i => {
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

    put( opts ) {
        return this.create( Object.assign( opts, { method: 'PUT' } ) )
    },

} ), { } )

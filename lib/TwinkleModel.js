module.exports = Object.assign( require('../../lib/MyObject'), {

    ColumnFixture: require('./ColumnFixture'),

    Postgres: require('../../dal/Postgres'),

    Request: require('./Request'),

    constructor( metadata ) { return Object.assign( this, { data: { } }, metadata ) },
    
    create() {
        return Promise.all(
            this.Postgres.tables[ this.resource ].columns
                .filter( column => column.name !== 'id' && this.data[ column.name ] === undefined )
                .map( column => this.ColumnFixture( column, { headers: this._getHeaders() } ).then( result => this.data[ column.name ] = result ) )
        ).then( () => Promise.resolve( this.data ) )
    },

    save( opts={} ) {
        return this.Request( {
            body: this.data,
            headers: this._getHeaders(),
            method: opts.method ? opts.method : this.data.id ? 'PATCH' : 'POST',
            path: `/${this.resource}${this.data.id ? "/"+this.data.id : ''}`
        } )
        .then( ( [ body, message ] ) => {
            if( message.statusCode !== 200 ) return Promise.reject(body)
            this.data = body
            return Promise.resolve(body)
        } )
    },

    _getHeaders() {
        return this.token ? { token: this.token } : { }
    },
} )

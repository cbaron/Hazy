module.exports = Object.assign( { }, require('../lib/MyObject'), {

    Common: require('./lib/Common'),
    
    Db: require('./lib/Db'),

    Jwt: require('./lib/Jwt'),

    Model: require('../lib/Model'),

    Permissions: require('./.Permissions'),

    Mongo: require('../dal/Mongo'),

    Postgres: require('../dal/Postgres'),

    QueryString: require('querystring'),

    Response: require('./lib/Response'),

    apply( method, check=true ) {
        if( check && this[method] ) return this[method]()

        return this.getUser()
        .then( () => this.validateUser() ) 
        .then( () => 
            method === 'GET'
                ? Promise.resolve( this.getQs() )
                : method === 'PATCH' || method === 'POST' || method === 'PUT'
                    ? this.slurpBody()
                    : method === 'DELETE'
                        ? Promise.resolve()
                        : Promise.resolve( this.respond( { stopChain: true, code: 404 } ) )
        )
        .then( () => this.Db.apply( this ) )
        .then( result => this.Response.apply( this, result ) )
    },

    badRequest() { return Promise.resolve( this.respond( { stopChain: true, body: { message: 'Bad Request' }, code: 400 } ) ) },

    end( data ) {
        return new Promise( resolve => {
            data.body = JSON.stringify( data.body )
            this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
            this.response.end( data.body )
            resolve()
        } )
    },

    getHeaders( body ) { return Object.assign( {}, this.headers, { 'Date': new Date().toISOString(), 'Content-Length': Buffer.byteLength( body ) } ) },

    getQs() {
        this.query = this.qs.length ? JSON.parse( this.QueryString.unescape( this.qs ) ) : { }
    },

    getUser() {
        return this.Jwt.parseToken( this.parseCookies( this.request.headers.cookie ) )
        .then( user => Promise.resolve( this.user = user ) )
    },

    headers: {
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Keep-Alive': 'timeout=50, max=100'
    },

    parseCookies( cookies ) {
        var rv

        if( ! cookies ) return ''

        cookies.split(';').forEach( cookie => {
            var parts = cookie.split('='),
                name = parts.shift().trim()

            if( name === process.env.COOKIE ) rv = parts.join('=')
        } )

        return rv
    },

    respond( data ) {
        if( typeof data.body !== 'string' ) data.body = JSON.stringify( data.body || {} )

        this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
        this.response.end( data.body )
        if( data.stopChain ) { throw new Error("Handled") }
    },

    slurpBody() {
        return new Promise( ( resolve, reject ) => {
            var body = ''
            
            this.request.on( "data", data => {
                body += data

                if( body.length > 1e10 ) {
                    response.request.connection.destroy()
                    reject( new Error("Too many bits") )
                }
            } )

            this.request.on( "end", () => {
                try { resolve(this.body = JSON.parse( body )) }
                catch( e ) { reject( 'Unable to parse request : ' + e ) }
            } )
        } )
    },

    validateUser() {
        const permissions = this.Permissions[ this.path[0] ] && this.Permissions[ this.path[0] ][ this.request.method ]

        if( ( this.user.id === undefined && this.request.method !== 'GET' ) ||
            permissions && this.user.roles.find( role => permissions.has( role ) ) === undefined
          ) { return this.respond( { stopChain: true, code: 401, body: { } } ) }

        return Promise.resolve()
    }
    
} )
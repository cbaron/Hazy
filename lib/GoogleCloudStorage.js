module.exports = Object.create( Object.assign( { }, require('./MyObject'), {

    Key: require('../private/google'),

    Google: require('googleapis'),

    QueryString: require('querystring'),

    currentToken: { expiry_date: 0 },

    getName( uri ) { return uri.slice( uri.lastIndexOf('/') + 1 ) },
    
    getToken() {
        if( this.currentToken.expiry_date > new Date().getTime() ) return Promise.resolve( this.currentToken )

        const client = new this.Google.auth.JWT( this.Key.client_email, null, this.Key.private_key, [ 'https://www.googleapis.com/auth/devstorage.full_control' ], null )

        return this.P( client.authorize, [ ], client )
        .then( ( [ token ] ) => {
            this.currentToken = token
            return Promise.resolve( token )
        } )
    },

    getUri( id ) { return `https://storage.googleapis.com/${process.env.GOOGLE_BUCKET}/${id}` },

    headers( token ) {
        return {
            Authorization: `Bearer ${token}`,
            'content-type': "application/octet-stream",
            accept: "application/json"
        }
    },

    hostname: 'www.googleapis.com',

    Request: require('../test/lib/Request'),

    GET( name ) {
        return this.getToken()
        .then( token => 
            this.Request( {
                headers: this.headers( token.access_token ),
                method: 'GET',
                hostname: this.hostname,
                path: `/storage/v1/b/${process.env.GOOGLE_BUCKET}/o/${this.QueryString.escape(name)}`,
                protocol: 'https',
                port: 443,
                streamIn: true
            } )
        )
    },

    DELETE( name ) {
        return this.getToken()
        .then( token => 
            this.Request( {
                headers: this.headers( token.access_token ),
                method: 'DELETE',
                hostname: this.hostname,
                path: `/storage/v1/b/${process.env.GOOGLE_BUCKET}/o/${this.QueryString.escape(name)}`,
                protocol: 'https',
                port: 443
            } )
        )
        .then( ( [ body, response ] ) => {
            return Promise.resolve( [ response.statusCode, body ] )
        } )
    },

    POST( name, stream ) {
        return this.getToken()
        .then( token =>
            this.Request( {
                streamOut: stream,
                headers: this.headers( token.access_token ),
                method: 'POST',
                hostname: this.hostname,
                path: `/upload/storage/v1/b/${process.env.GOOGLE_BUCKET}/o?${this.QueryString.stringify( { uploadType: 'media', name, predefinedAcl: 'publicRead' } )}`,
                protocol: 'https',
                port: 443
            } )
        )
        .then( ( [ body, response ] ) => Promise.resolve( [ response.statusCode, body ] ) )
    }

} ), { } )

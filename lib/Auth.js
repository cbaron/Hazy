module.exports = Object.create( Object.assign( { }, require('../../lib/MyObject'), {

    Bcrypt: require('bcrypt'),

    Jws: require('jws'),

    Salt: parseInt( process.env.SALT ),

    createPassword( pw ) {
        return this.P( this.Bcrypt.hash, [ pw, this.Salt ] )
        .then( ( [ pw ] ) => Promise.resolve(pw) )
    },

    getToken( obj ) {
        return new Promise( ( resolve, reject ) =>
            this.Jws.createSign( {
                header: { "alg": "HS256", "typ": "JWT" },
                payload: JSON.stringify( obj ),
                privateKey: process.env.JWS_SECRET
            } )
            .on( 'done', resolve )
            .on( 'error', reject )
        )
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

} ), { } )

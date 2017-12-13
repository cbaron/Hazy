module.exports = Object.assign( { }, require('./__proto__'), {

    apply( method ) {
        if( method !== 'POST' ) return this.badRequest()

        return this.slurpBody()
        .then( () =>
            this.Jwt.makeToken( this.body )
            .then( token =>
                this.respond( {
                    body: {},
                    headers: {
                        'Set-Cookie': `${process.env.COOKIE}=${token}; Expires=${new Date("3030-03-30").toUTCString()}`
                    }
                } )
            )
        )
    },

} )
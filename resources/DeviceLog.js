const proto = require('./__proto__')

module.exports = Object.assign( { }, proto, {

    apply( method ) {
        if( method !== "GET" && method !== "POST" && method !== "DELETE" ) return Promise.resolve( this.respond( { stopChain: true, code: 404 } ) )

        return proto.apply.call( this, method )
    }

} )
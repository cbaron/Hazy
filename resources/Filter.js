module.exports = Object.assign( { }, require('./__proto__'), {

    apply( method ) {
        if( method !== 'GET' ) return Promise.resolve( this.respond( { stopChain: true, code: 404 } ) )
        return Promise.resolve( this.respond( { body: this.Mongo.filters } ) )
    }

} )
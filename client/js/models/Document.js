module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: {
    },

    data: {
    },

    meta: {
        key: '_id',
    },

    toList( document ) {
        document = document || this.data
        return Object.keys( document ).sort().map( key => ( { key, value: document[ key ] } ) )
    }

} )

module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: {
    },

    data: {
    },

    meta: {
        key: '_id',
        sort: { 'title': 1 }
    },

    resource: 'DiscType',

    toList() {
        return Object.keys( this.data ).sort().map( key => ( { key, value: this.data[ key ] } ) )
    }
} )

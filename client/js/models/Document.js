module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: {
    },

    data: {
    },

    meta: {
        key: '_id',
        sort: { 'label': 1 }
    },

    toList() {
        return Object.keys( this.data ).sort().map( key => ( { key, value: this.data[ key ] } ) )
    }

} )

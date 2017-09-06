module.exports = Object.assign( {}, require('./__proto__'), {

    getViewName( value ) {
        return Array.isArray( value )
            ? 'Array'
            : typeof value === 'object'
                ? 'Json'
                : 'Literal'
    },

    isEditable( key ) { return key === '_id' },

} )

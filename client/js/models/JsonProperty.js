module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: [
        {
            default: 'key',
            name: 'key',
            label: 'Key'
        },
        {
            default: 'value',
            name: 'value',
            label: 'Value'
        }
    ],

    data: {
    },

    isEditable( key ) { return key !== '_id' }
} )

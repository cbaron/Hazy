module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: [
        {
            name: 'name',
            label: 'Name',
            range: 'String',
            error: 'Please enter a name with no spaces.',
            validate: val => val.trim() !== '' && !/\s/.test(val),
            metadata: { }
        }
    ],

    meta: {
        key: 'name'
    },

    resource: 'Collection'
} )

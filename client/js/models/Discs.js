module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: require('../../../models/Disc').attributes,

    data: {
        filters: [
            { name: 'DiscClass', label: 'Class' }
        ]
    },

    resource: 'Disc'

} )
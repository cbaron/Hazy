module.exports = Object.assign( {}, require('./__proto__'), {

    attributes: require('../../../models/Disc').attributes,

    meta: {
        filterCategories: [
            { name: 'DiscClass', label: 'Class', fk: true }
        ] 
    },

    resource: 'Disc',

    storeBy: [ '_id' ]

} )
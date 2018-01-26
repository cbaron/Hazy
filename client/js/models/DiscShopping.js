module.exports = Object.assign( {}, require('./__proto__'), {

    meta: {
        filterCategories: [
            { name: 'DiscClass', label: 'Class', collection: 'DiscType', fk: true },
            { name: 'Manufacturer', label: 'Manufacturer', collection: 'DiscType', fk: true },
            { name: 'weight', label: 'Weight (g)', collection: 'Disc', minMax: true },
            { name: 'color', label: 'Color', collection: 'Disc' }
        ] 
    },

    resource: 'Filter'

} )
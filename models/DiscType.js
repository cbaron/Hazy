const Super = require('./__proto__')

module.exports = {
    attributes: Super.createAttributes( [ {
        fk: 'Vendor'
    }, {
        fk: 'PlasticType'
    }, {
        isNullable: false,
        label: 'Desription',
        name: 'description',
        range: 'Text'
    }, {
        label: 'Flight',
        name: 'flight',
        range: [ {
            name: 'speed',
            label: 'Speed',
            range: 'Integer'
        }, {
            name: 'fade',
            label: 'Fade',
            range: 'Integer'
        }, {
            name: 'glide',
            label: 'Glide',
            range: 'Integer'
        }, {
            name: 'turn',
            label: 'Turn',
            range: 'Integer'
        } ]
    }, {
        name: 'mold',
        label: 'Mold',
        range: 'String'
    }, {
        fk: 'Manufacturer'
    }, {
        name: 'patent',
        label: 'Patent',
        range: 'String'
    } ] )
}
